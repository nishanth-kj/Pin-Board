use eframe::egui;
use serde::{Deserialize, Serialize};
use std::time::Duration;
use chrono::Local;

use crate::pin::Pin;
use crate::timer::TimerState;
use tray_icon::{
    menu::{Menu, MenuEvent, MenuItem},
    TrayIconBuilder, TrayIcon
};

#[derive(Serialize, Deserialize)]
pub struct AppState {
    pub pins: Vec<Pin>,
    pub global_timer: TimerState,
    #[serde(skip)]
    pub new_pin_content: String,
    #[serde(skip)]
    pub new_pin_minutes: u64,
    #[serde(skip)]
    pub _tray: Option<TrayIcon>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            pins: Vec::new(),
            global_timer: TimerState::default(),
            new_pin_content: String::new(),
            new_pin_minutes: 0,
            _tray: None,
        }
    }
}

impl AppState {
    pub fn new(cc: &eframe::CreationContext) -> Self {
        let mut visuals = egui::Visuals::dark();
        visuals.window_rounding = egui::Rounding::same(16.0);
        visuals.window_shadow = egui::epaint::Shadow {
            offset: egui::vec2(0.0, 10.0),
            blur: 20.0,
            spread: 2.0,
            color: egui::Color32::from_black_alpha(100),
        };
        visuals.widgets.noninteractive.bg_fill = egui::Color32::from_gray(20);
        visuals.widgets.noninteractive.rounding = egui::Rounding::same(12.0);
        
        cc.egui_ctx.set_visuals(visuals);

        // Initialize Tray Icon (Safe on Linux after GTK init)
        let tray_menu = Menu::new();
        let quit = MenuItem::with_id("quit", "Exit Pin-Board", true, None);
        let _ = tray_menu.append_items(&[&quit]);
        
        let icon_rgba = vec![120u8, 180, 255, 255].into_iter().cycle().take(64 * 64 * 4).collect();
        let icon = tray_icon::Icon::from_rgba(icon_rgba, 64, 64).expect("Tray Icon Error");
        
        let tray = TrayIconBuilder::new()
            .with_menu(Box::new(tray_menu))
            .with_tooltip("Pin-Board")
            .with_icon(icon)
            .build()
            .ok();

        // Tray Event Listener
        std::thread::spawn(move || {
            let receiver = MenuEvent::receiver();
            loop {
                if let Ok(event) = receiver.try_recv() {
                    if event.id == "quit" { std::process::exit(0); }
                }
                std::thread::sleep(std::time::Duration::from_millis(200));
            }
        });

        if let Some(storage) = cc.storage {
             if let Some(value) = storage.get_string("pinboard_state") {
                 let mut app: AppState = serde_json::from_str(&value).unwrap_or_default();
                 app._tray = tray;
                 for pin in &mut app.pins {
                     if pin.opacity == 0.0 { pin.opacity = 0.95; }
                 }
                 return app;
             }
        }
        
        let mut app = AppState::default();
        app._tray = tray;
        app
    }

    fn render_dashboard(&mut self, ctx: &egui::Context) {
        let panel_frame = egui::Frame::none()
            .fill(egui::Color32::from_rgb(10, 10, 10)) // Pure Dark
            .inner_margin(20.0);

        egui::CentralPanel::default().frame(panel_frame).show(ctx, |ui| {
            // Header
            ui.horizontal(|ui| {
                ui.vertical(|ui| {
                    ui.horizontal(|ui| {
                        ui.heading(egui::RichText::new("Pin").strong().color(egui::Color32::WHITE).size(26.0));
                        ui.heading(egui::RichText::new("-Board").strong().color(egui::Color32::from_rgb(80, 160, 255)).size(26.0));
                    });
                    ui.label(egui::RichText::new("NATIVE MINIMALIST WORKSPACE").size(10.0).strong().color(egui::Color32::from_gray(80)));
                });
            });
            
            ui.add_space(24.0);

            // Vibrant Stats
            ui.columns(3, |columns| {
                let active = self.pins.iter().filter(|p| !p.is_completed).count();
                let completed = self.pins.iter().filter(|p| p.is_completed).count();
                
                self.stat_card(&mut columns[0], "PENDING", &active.to_string(), egui::Color32::from_rgb(52, 211, 153)); // Emerald
                self.stat_card(&mut columns[1], "ARCHIVED", &completed.to_string(), egui::Color32::from_rgb(251, 113, 133)); // Rose
                
                let time = format!("{:02}:{:02}", self.global_timer.remaining_secs/60, self.global_timer.remaining_secs%60);
                let timer_color = if self.global_timer.is_running { egui::Color32::from_rgb(251, 191, 36) } else { egui::Color32::from_gray(100) };
                self.stat_card(&mut columns[2], "FOCUS", &time, timer_color); // Amber
            });

            ui.add_space(28.0);

            // New Pin Glass Card
            egui::Frame::none()
                .fill(egui::Color32::from_gray(20))
                .inner_margin(16.0)
                .rounding(16.0)
                .stroke(egui::Stroke::new(1.0, egui::Color32::from_gray(40)))
                .show(ui, |ui| {
                    ui.horizontal(|ui| {
                        ui.label(egui::RichText::new("Quick Note").strong().color(egui::Color32::from_gray(180)));
                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                             if self.new_pin_minutes > 0 {
                                 ui.label(egui::RichText::new(format!("⏰ {}m", self.new_pin_minutes)).size(11.0).strong().color(egui::Color32::from_rgb(80, 160, 255)));
                             }
                        });
                    });
                    
                    ui.add_space(10.0);
                    
                    ui.add_space(4.0);
                    
                    let edit = egui::TextEdit::multiline(&mut self.new_pin_content)
                        .hint_text("First line is your title...\nDescription follows...")
                        .desired_rows(3)
                        .desired_width(f32::INFINITY)
                        .margin(egui::vec2(6.0, 6.0))
                        .font(egui::FontId::proportional(15.0));
                    
                    ui.add(edit);

                    ui.add_space(14.0);
                    
                    ui.horizontal(|ui| {
                        ui.spacing_mut().item_spacing.x = 8.0;
                        
                        ui.label(egui::RichText::new("Timer:").size(11.0).color(egui::Color32::from_gray(120)));
                        ui.add(egui::DragValue::new(&mut self.new_pin_minutes).suffix("m").range(0..=999).speed(1.0));
                        
                        if self.new_pin_minutes > 0 {
                             if ui.small_button("Clear").clicked() { self.new_pin_minutes = 0; }
                        }

                        ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                            let can_create = !self.new_pin_content.is_empty();
                            let btn = egui::Button::new(egui::RichText::new("PIN IT").strong().size(12.0))
                                .min_size(egui::vec2(80.0, 28.0))
                                .fill(if can_create { egui::Color32::from_rgb(50, 130, 255) } else { egui::Color32::from_gray(40) })
                                .rounding(8.0);
                            
                            if ui.add_enabled(can_create, btn).clicked() {
                                let deadline = if self.new_pin_minutes > 0 {
                                    Some(Local::now() + chrono::Duration::minutes(self.new_pin_minutes as i64))
                                } else { None };
                                
                                let trimmed = self.new_pin_content.trim();
                                let (title, body) = if let Some((first, rest)) = trimmed.split_once('\n') {
                                    (first.to_string(), rest.trim().to_string())
                                } else {
                                    (trimmed.to_string(), String::new())
                                };
                                
                                self.pins.push(Pin::new(title, body, deadline));
                                self.new_pin_content.clear();
                                self.new_pin_minutes = 0;
                            }
                        });
                    });
                });

            ui.add_space(24.0);
            
            // Global Timer Control
            ui.horizontal(|ui| {
                ui.label(egui::RichText::new("SET TIMER:").size(10.0).strong().color(egui::Color32::from_gray(60)));
                
                let mut minutes = self.global_timer.duration_secs / 60;
                if minutes == 0 { minutes = 25; }
                
                if ui.small_button("-").clicked() && minutes > 1 { minutes -= 1; }
                ui.add(egui::DragValue::new(&mut minutes).suffix("m").range(1..=999));
                if ui.small_button("+").clicked() { minutes += 1; }
                
                ui.add_space(8.0);

                if ui.add(egui::Button::new(egui::RichText::new("START").size(10.0).strong()).rounding(4.0)).clicked() {
                    self.global_timer.start(minutes);
                }

                ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                    ui.spacing_mut().item_spacing.x = 6.0;
                    if ui.small_button("CLEAN").clicked() { self.pins.retain(|p| !p.is_completed); }
                    if ui.small_button("HIDE ALL").clicked() { for p in &mut self.pins { p.visible = false; } }
                    if ui.small_button("SHOW ALL").clicked() { for p in &mut self.pins { p.visible = true; } }
                });
            });

            ui.add_space(12.0);
            ui.separator();
            ui.add_space(12.0);

            // Dashboard List
            egui::ScrollArea::vertical().auto_shrink([false; 2]).show(ui, |ui| {
                 if self.pins.is_empty() {
                     ui.add_space(40.0);
                     ui.vertical_centered(|ui| {
                         ui.label(egui::RichText::new("Your workspace is empty").color(egui::Color32::from_gray(60)));
                     });
                 }

                 let mut action = None;

                 for (i, pin) in self.pins.iter().enumerate() {
                    if i > 0 { ui.add_space(4.0); }
                    
                    let mut toggle_viz = false;
                    let mut delete = false;

                    egui::Frame::none()
                        .fill(egui::Color32::from_gray(18))
                        .inner_margin(12.0)
                        .rounding(10.0)
                        .stroke(egui::Stroke::new(1.0, egui::Color32::from_gray(30)))
                        .show(ui, |ui| {
                            ui.horizontal(|ui| {
                                 let preview = pin.content.lines().next().unwrap_or("").chars().take(22).collect::<String>();
                                 // Simple text indicators instead of emoji
                                 let status_txt = if pin.is_completed { "(Done)" } else { "•" };
                                 ui.label(egui::RichText::new(status_txt).size(10.0).color(if pin.is_completed { egui::Color32::from_gray(100) } else { egui::Color32::from_rgb(80, 160, 255) }));
                                 ui.label(egui::RichText::new(preview).color(if pin.is_completed { egui::Color32::from_gray(60) } else { egui::Color32::from_gray(200) }));
                                 
                                 ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                                     ui.style_mut().spacing.item_spacing.x = 10.0;
                                     
                                     // Painted Close Icon
                                     let (rect, resp) = ui.allocate_exact_size(egui::vec2(14.0, 14.0), egui::Sense::click());
                                     let painter = ui.painter();
                                     let c = rect.center();
                                     let r = 3.5;
                                     let color = if resp.hovered() { egui::Color32::RED } else { egui::Color32::GRAY };
                                     painter.line_segment([c + egui::vec2(-r, -r), c + egui::vec2(r, r)], egui::Stroke::new(1.5, color));
                                     painter.line_segment([c + egui::vec2(-r, r), c + egui::vec2(r, -r)], egui::Stroke::new(1.5, color));
                                     if resp.clicked() { delete = true; }

                                     // Painted Eye Icon
                                     let (rect, resp) = ui.allocate_exact_size(egui::vec2(16.0, 14.0), egui::Sense::click());
                                     let painter = ui.painter();
                                     let c = rect.center();
                                     let color = if resp.hovered() { egui::Color32::WHITE } else { egui::Color32::GRAY };
                                     
                                     if pin.visible {
                                         // Eye Open
                                         painter.circle_stroke(c, 4.0, egui::Stroke::new(1.5, color));
                                         painter.circle_filled(c, 1.5, color);
                                     } else {
                                         // Eye Closed (Strike)
                                         painter.circle_stroke(c, 4.0, egui::Stroke::new(1.0, color.gamma_multiply(0.5)));
                                         painter.line_segment([c + egui::vec2(-4.0, 4.0), c + egui::vec2(4.0, -4.0)], egui::Stroke::new(1.5, color));
                                     }
                                     if resp.clicked() { toggle_viz = true; }
                                 });
                            });
                        });
                    
                    if toggle_viz { action = Some(("toggle", i)); }
                    if delete { action = Some(("delete", i)); }
                 }

                 if let Some((act, idx)) = action {
                     match act {
                         "toggle" => self.pins[idx].visible = !self.pins[idx].visible,
                         "delete" => { self.pins.remove(idx); },
                         _ => {}
                     }
                 }
            });
        });
    }

    fn stat_card(&self, ui: &mut egui::Ui, label: &str, value: &str, color: egui::Color32) {
        egui::Frame::none()
            .fill(egui::Color32::from_gray(15))
            .inner_margin(12.0)
            .rounding(12.0)
            .stroke(egui::Stroke::new(1.0, egui::Color32::from_gray(30)))
            .show(ui, |ui| {
                ui.set_width(ui.available_width());
                ui.vertical_centered(|ui| {
                    ui.label(egui::RichText::new(value).size(24.0).strong().color(color));
                    ui.label(egui::RichText::new(label).size(9.0).strong().color(egui::Color32::from_gray(80)));
                });
            });
    }

    fn render_pins(&mut self, ctx: &egui::Context) {
        let mut to_delete = Vec::new();
        let mut to_clone = Vec::new();
        
        for (idx, pin) in self.pins.iter_mut().enumerate() {
             let (deleted, cloned) = pin.render(ctx);
             if deleted { to_delete.push(idx); }
             if let Some(c) = cloned { to_clone.push(c); }
        }
        
        to_delete.sort_by(|a, b| b.cmp(a));
        for idx in to_delete { self.pins.remove(idx); }
        for pin in to_clone { self.pins.push(pin); }
    }

    fn render_global_timer(&mut self, ctx: &egui::Context) {
        if !self.global_timer.show_popup { return; }

        ctx.show_viewport_immediate(
            egui::ViewportId::from_hash_of("global_timer"),
            egui::ViewportBuilder::default()
                .with_title("Timer")
                .with_inner_size([200.0, 100.0])
                .with_always_on_top()
                .with_transparent(true)
                .with_decorations(false)
                .with_taskbar(false),
            |ctx, _| {
                 let rect = ctx.available_rect();
                 let painter = ctx.layer_painter(egui::LayerId::background());
                 painter.rect_filled(rect.shrink(2.0), egui::Rounding::same(20.0), egui::Color32::from_black_alpha(220));
                 painter.rect_stroke(rect.shrink(2.0), egui::Rounding::same(20.0), egui::Stroke::new(1.5, egui::Color32::from_rgb(100, 150, 255)));

                 egui::CentralPanel::default().frame(egui::Frame::none().inner_margin(12.0)).show(ctx, |ui| {
                     let drag_response = ui.interact(rect, ui.id().with("drag"), egui::Sense::drag());
                     if drag_response.dragged() { ctx.send_viewport_cmd(egui::ViewportCommand::StartDrag); }
                     
                     ui.vertical_centered(|ui| {
                         ui.label(egui::RichText::new(
                             format!("{:02}:{:02}", self.global_timer.remaining_secs/60, self.global_timer.remaining_secs%60)
                         ).size(34.0).strong().monospace().color(egui::Color32::WHITE));
                         
                         ui.add_space(4.0);
                         
                         ui.horizontal(|ui| {
                             ui.set_height(24.0);
                             let btn_size = egui::vec2(24.0, 24.0);
                             
                             if self.global_timer.is_running {
                                 if ui.add(egui::Button::new("⏸").min_size(btn_size).frame(false)).clicked() { self.global_timer.is_running = false; }
                             } else {
                                 if ui.add(egui::Button::new("▶").min_size(btn_size).frame(false)).clicked() { 
                                     self.global_timer.is_running = true; 
                                 }
                             }
                             
                             if ui.add(egui::Button::new("⏹").min_size(btn_size).frame(false)).clicked() { 
                                 self.global_timer.stop();
                             }
                         });
                     });
                 });
            }
        );
    }
}

impl eframe::App for AppState {
    fn save(&mut self, storage: &mut dyn eframe::Storage) {
         if let Ok(value) = serde_json::to_string(self) {
             storage.set_string("pinboard_state", value);
         }
    }

    fn update(&mut self, ctx: &egui::Context, _frame: &mut eframe::Frame) {
        if self.global_timer.is_running || self.pins.iter().any(|p| p.deadline.is_some() && !p.is_completed) {
            ctx.request_repaint_after(Duration::from_secs(1));
        }
        self.global_timer.update();
        self.render_dashboard(ctx);
        self.render_global_timer(ctx);
        self.render_pins(ctx);
    }
}
