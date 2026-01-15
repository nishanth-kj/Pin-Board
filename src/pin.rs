use eframe::egui;
use serde::{Deserialize, Serialize};
use chrono::{Local, DateTime};
use uuid::Uuid;

#[derive(Serialize, Deserialize, Clone)]
pub struct Pin {
    pub id: String,
    #[serde(default)]
    pub title: String,
    pub content: String,
    pub color_idx: usize,
    #[serde(default)]
    pub is_completed: bool,
    #[serde(default)]
    pub created_at: String,
    #[serde(default)]
    pub deadline: Option<DateTime<Local>>, 
    #[serde(default = "default_true")]
    pub visible: bool,
    #[serde(default = "default_opacity")]
    pub opacity: f32,
    #[serde(default)]
    pub size: Option<(f32, f32)>,
    #[serde(default)]
    pub is_locked: bool,
    #[serde(skip)]
    pub show_menu: bool,
    #[serde(default = "default_true")]
    pub is_always_on_top: bool,
}

fn default_true() -> bool { true }
fn default_opacity() -> f32 { 0.95 }

impl Pin {
    pub fn new(title: String, content: String, deadline: Option<DateTime<Local>>) -> Self {
        Self {
            id: Uuid::new_v4().to_string(),
            title,
            content,
            color_idx: 0,
            is_completed: false,
            created_at: Local::now().format("%I:%M %p").to_string(),
            deadline,
            visible: true,
            opacity: 0.95,
            size: None,
            is_locked: false,
            show_menu: false,
            is_always_on_top: true,
        }
    }

    pub fn render(&mut self, ctx: &egui::Context) -> (bool, Option<Pin>) {
        if !self.visible { return (false, None); }
        
        let viewport_id = egui::ViewportId::from_hash_of(&self.id);
        let builder = self.create_viewport_builder();
        
        // State to extract from closures
        let mut delete_requested = false;
        let mut clone_requested = None;

        ctx.show_viewport_immediate(viewport_id, builder, |ctx, _| {
            // Update size persistence
            if let Some(rect) = ctx.input(|i| i.viewport().inner_rect) {
                let (w, h) = (rect.width(), rect.height());
                if w > 10.0 && h > 10.0 {
                     if let Some((cw, ch)) = self.size {
                         if (cw - w).abs() > 1.0 || (ch - h).abs() > 1.0 {
                             self.size = Some((w, h));
                         }
                     } else {
                         self.size = Some((w, h));
                     }
                }
            }

            let base_color = self.get_color();
            self.paint_background(ctx, base_color);

            // 1. Header (Top)
            egui::TopBottomPanel::top("pin_header")
                .frame(egui::Frame::none().inner_margin(egui::Margin { top: 12.0, left: 12.0, right: 12.0, bottom: 4.0 }))
                .show(ctx, |ui| {
                    let (del, cln) = self.render_header(ui);
                    if del { delete_requested = true; }
                    if cln.is_some() { clone_requested = cln; }
                });

            // 2. Footer (Bottom)
            egui::TopBottomPanel::bottom("pin_footer")
                .frame(egui::Frame::none().inner_margin(egui::Margin { top: 4.0, left: 12.0, right: 12.0, bottom: 12.0 }))
                .show(ctx, |ui| {
                    self.render_footer(ui, ctx);
                });

            // 3. Content (Fills Middle)
            egui::CentralPanel::default()
                .frame(egui::Frame::none().inner_margin(egui::Margin::symmetric(12.0, 0.0)))
                .show(ctx, |ui| {
                    self.render_content(ui);
                });

            // 4. Menu Window (if open)
            if let Some(cloned) = self.render_menu(ctx) {
                clone_requested = Some(cloned);
            }

            if ctx.input(|i| i.viewport().close_requested()) { delete_requested = true; }
        });
        
        (delete_requested, clone_requested)
    }

    fn create_viewport_builder(&self) -> egui::ViewportBuilder {
        let size = self.size.unwrap_or((280.0, 240.0));
        let mut builder = egui::ViewportBuilder::default()
            .with_title(if self.title.is_empty() { "Pin".to_string() } else { self.title.clone() })
            .with_transparent(true)
            .with_decorations(false)
            .with_taskbar(false)
            .with_resizable(true)
            .with_inner_size(size);
        
        if self.is_always_on_top {
            builder = builder.with_always_on_top();
        }
        
        builder
    }

    fn get_color(&self) -> egui::Color32 {
        let colors = [
            egui::Color32::from_rgb(255, 235, 156), // Warm Yellow
            egui::Color32::from_rgb(186, 237, 255), // Soft Blue
            egui::Color32::from_rgb(255, 179, 186), // Pastel Pink
            egui::Color32::from_rgb(179, 255, 196), // Mint Green
            egui::Color32::from_rgb(222, 186, 255), // Lavender
            egui::Color32::from_rgb(255, 218, 186), // Peach
        ];
        colors[self.color_idx % colors.len()]
    }

    fn paint_background(&self, ctx: &egui::Context, color: egui::Color32) {
        let rect = ctx.available_rect();
        let painter = ctx.layer_painter(egui::LayerId::background());
        painter.rect_filled(rect.shrink(2.0), egui::Rounding::same(12.0), egui::Color32::from_black_alpha(40));
        painter.rect_filled(rect.shrink(4.0), egui::Rounding::same(12.0), color.linear_multiply(self.opacity));
        let stroke_color = if self.is_completed { egui::Color32::BLACK.gamma_multiply(0.1) } else { egui::Color32::BLACK.gamma_multiply(0.3) };
        painter.rect_stroke(rect.shrink(4.0), egui::Rounding::same(12.0), egui::Stroke::new(1.0, stroke_color));
    }

    fn render_header(&mut self, ui: &mut egui::Ui) -> (bool, Option<Pin>) {
        let mut delete_requested = false;
        let clone_requested = None;

        ui.horizontal(|ui| {
            ui.set_height(28.0);
            ui.spacing_mut().item_spacing.x = 6.0;

            // Checkbox (Left)
            ui.add_enabled(!self.is_locked, egui::Checkbox::new(&mut self.is_completed, ""));

            // Drag Icon - small grip handle ONLY for dragging
            if !self.is_locked {
                let drag_size = egui::vec2(20.0, 20.0);
                let drag_id = egui::Id::new(format!("drag_{}", self.id));
                
                // Allocate space and get response
                let (drag_rect, _) = ui.allocate_exact_size(drag_size, egui::Sense::hover());
                let drag_resp = ui.interact(drag_rect, drag_id, egui::Sense::drag());
                
                let painter = ui.painter();
                
                // Draw 6-dot grip pattern
                let c = drag_rect.center();
                let dot_color = if drag_resp.hovered() || drag_resp.dragged() { 
                    egui::Color32::BLACK 
                } else { 
                    egui::Color32::from_gray(120) 
                };
                
                for row in -1..=1 {
                    for col in 0..=1 {
                        painter.circle_filled(
                            c + egui::vec2(col as f32 * 5.0 - 2.5, row as f32 * 5.0), 
                            1.5, 
                            dot_color
                        );
                    }
                }
                
                // Use OS-level drag
                if drag_resp.drag_started() {
                    ui.ctx().send_viewport_cmd(egui::ViewportCommand::StartDrag);
                }
                
                if drag_resp.hovered() {
                    ui.ctx().set_cursor_icon(egui::CursorIcon::Grab);
                }
            }

            // Timer display
            if let Some(dl) = self.deadline {
                let rem = dl - Local::now();
                let txt = if rem.num_seconds() > 0 {
                    format!("{:02}:{:02}", rem.num_minutes(), rem.num_seconds() % 60)
                } else { "TIME!".to_string() };
                ui.label(egui::RichText::new(txt).monospace().size(11.0).strong());
            }

            // Spacer - push buttons to right
            ui.add_space(ui.available_width() - 56.0);

            // Menu button (3 dots painted)
            let menu_size = egui::vec2(24.0, 24.0);
            let (menu_rect, menu_resp) = ui.allocate_exact_size(menu_size, egui::Sense::click());
            let painter = ui.painter();
            let menu_color = if menu_resp.hovered() { egui::Color32::BLACK } else { egui::Color32::from_gray(100) };
            let mc = menu_rect.center();
            painter.circle_filled(mc + egui::vec2(0.0, -5.0), 2.0, menu_color);
            painter.circle_filled(mc, 2.0, menu_color);
            painter.circle_filled(mc + egui::vec2(0.0, 5.0), 2.0, menu_color);
            
            if menu_resp.clicked() {
                self.show_menu = !self.show_menu;
            }

            // Close button (X painted)
            if !self.is_locked {
                let close_size = egui::vec2(24.0, 24.0);
                let (close_rect, close_resp) = ui.allocate_exact_size(close_size, egui::Sense::click());
                let painter = ui.painter();
                let close_color = if close_resp.hovered() { egui::Color32::from_rgb(220, 60, 60) } else { egui::Color32::from_gray(120) };
                
                if close_resp.hovered() {
                    painter.rect_filled(close_rect, 4.0, egui::Color32::from_gray(230));
                }
                
                let cc = close_rect.center();
                let r = 5.0;
                painter.line_segment([cc + egui::vec2(-r, -r), cc + egui::vec2(r, r)], egui::Stroke::new(2.0, close_color));
                painter.line_segment([cc + egui::vec2(-r, r), cc + egui::vec2(r, -r)], egui::Stroke::new(2.0, close_color));

                if close_resp.clicked() { delete_requested = true; }
            }
        });

        (delete_requested, clone_requested)
    }

    fn render_menu(&mut self, ctx: &egui::Context) -> Option<Pin> {
        let mut clone_requested = None;
        
        if self.show_menu {
            let mut open = true;
            egui::Window::new("Pin Options")
                .id(egui::Id::new(format!("pin_menu_window_{}", self.id)))
                .collapsible(false)
                .resizable(false)
                .default_width(180.0)
                .open(&mut open)
                .show(ctx, |ui| {
                    ui.spacing_mut().item_spacing.y = 8.0;
                    
                    if ui.button(if self.is_locked { "Unlock Pin" } else { "Lock Pin" }).clicked() {
                        self.is_locked = !self.is_locked;
                        self.show_menu = false;
                    }
                    
                    if ui.button("Duplicate").clicked() {
                        clone_requested = Some(self.clone());
                        self.show_menu = false;
                    }
                    
                    ui.separator();
                    ui.label("Transparency");
                    ui.add(egui::Slider::new(&mut self.opacity, 0.2..=1.0).show_value(false));
                    
                    if self.deadline.is_some() {
                        ui.separator();
                        if ui.button("Clear Timer").clicked() {
                            self.deadline = None;
                            self.show_menu = false;
                        }
                    }
                    ui.separator();
                    
                    // Pin to Top toggle
                    if ui.button(if self.is_always_on_top { "📌 Unpin from Top" } else { "📌 Pin to Top" }).clicked() {
                        self.is_always_on_top = !self.is_always_on_top;
                        self.show_menu = false;
                    }
                    
                    ui.separator();
                    if ui.button("Close Menu").clicked() {
                        self.show_menu = false;
                    }
                });
            
            if !open {
                self.show_menu = false;
            }
        }
        
        clone_requested
    }

    fn render_content(&mut self, ui: &mut egui::Ui) {
        let text_color = if self.is_completed { 
            egui::Color32::from_black_alpha(100) 
        } else { 
            egui::Color32::from_rgb(30, 30, 30) 
        };

        egui::ScrollArea::vertical()
            .auto_shrink([false; 2]) // Allow growing
            .max_height(f32::INFINITY)
            .show(ui, |ui| {
                 // Title
                 if !self.title.is_empty() {
                     let mut title_edit = egui::TextEdit::singleline(&mut self.title)
                        .frame(false)
                        .text_color(if self.is_completed { text_color.gamma_multiply(0.8) } else { egui::Color32::BLACK })
                        .font(egui::FontId::proportional(18.0))
                        .desired_width(f32::INFINITY);
                     
                     if self.is_locked { title_edit = title_edit.interactive(false); }
                     ui.add(title_edit);
                     ui.add_space(4.0);
                 }

                // Content
                let mut edit = egui::TextEdit::multiline(&mut self.content)
                    .frame(false)
                    .desired_width(f32::INFINITY)
                    .text_color(text_color)
                    .font(egui::FontId::proportional(16.0))
                    .margin(egui::vec2(0.0, 4.0));
                
                if self.is_locked { edit = edit.interactive(false); }
                
                let resp = ui.add(edit);
                
                if self.is_completed {
                    let rect = resp.rect;
                    ui.painter().line_segment(
                        [egui::pos2(rect.left(), rect.center().y), egui::pos2(rect.right(), rect.center().y)],
                        egui::Stroke::new(1.2, egui::Color32::BLACK.gamma_multiply(0.4))
                    );
                }
            });
    }

    fn render_footer(&mut self, ui: &mut egui::Ui, ctx: &egui::Context) {
        ui.with_layout(egui::Layout::bottom_up(egui::Align::Min), |ui| {
            ui.add_space(4.0);
            
            ui.horizontal(|ui| {
                // Color Switcher
                let colors = [
                    egui::Color32::from_rgb(255, 235, 156), egui::Color32::from_rgb(186, 237, 255),
                    egui::Color32::from_rgb(255, 179, 186), egui::Color32::from_rgb(179, 255, 196),
                    egui::Color32::from_rgb(222, 186, 255), egui::Color32::from_rgb(255, 218, 186),
                ];

                ui.spacing_mut().item_spacing.x = 6.0;
                for (i, &c) in colors.iter().enumerate() {
                    let (rect, resp) = ui.allocate_exact_size(egui::vec2(12.0, 12.0), egui::Sense::click());
                    let painter = ui.painter();
                    painter.circle_filled(rect.center(), 5.0, c);
                    if i == self.color_idx {
                        painter.circle_stroke(rect.center(), 6.5, egui::Stroke::new(1.5, egui::Color32::BLACK.gamma_multiply(0.5)));
                    }
                    if resp.clicked() { self.color_idx = i; }
                    if resp.hovered() { ui.output_mut(|o| o.cursor_icon = egui::CursorIcon::PointingHand); }
                }

                // Metadata & Resize
                ui.with_layout(egui::Layout::right_to_left(egui::Align::Center), |ui| {
                    // Resize handle
                    let resize_id = egui::Id::new(format!("resize_{}", self.id));
                    let (rect, _) = ui.allocate_exact_size(egui::vec2(16.0, 16.0), egui::Sense::hover());
                    let resp = ui.interact(rect, resize_id, egui::Sense::drag());
                    
                    // Draw resize icon
                    let painter = ui.painter();
                    let color = if resp.hovered() || resp.dragged() { 
                        egui::Color32::BLACK.gamma_multiply(0.6) 
                    } else { 
                        egui::Color32::BLACK.gamma_multiply(0.3) 
                    };
                    painter.text(rect.center(), egui::Align2::CENTER_CENTER, "◢", egui::FontId::proportional(12.0), color);
                    
                    if resp.dragged() && !self.is_locked {
                        let delta = resp.drag_delta();
                        let current_size = self.size.unwrap_or((280.0, 240.0));
                        let new_w = (current_size.0 + delta.x).max(200.0);
                        let new_h = (current_size.1 + delta.y).max(150.0);
                        self.size = Some((new_w, new_h));
                        ctx.send_viewport_cmd(egui::ViewportCommand::InnerSize(egui::vec2(new_w, new_h)));
                    }
                    
                    if resp.hovered() { 
                        ui.ctx().set_cursor_icon(egui::CursorIcon::ResizeNwSe); 
                    }

                    ui.add_space(8.0);
                    ui.label(egui::RichText::new(&self.created_at).size(8.0).color(egui::Color32::BLACK.gamma_multiply(0.4)));
                    
                    // Completion Status
                    if self.is_completed {
                        ui.label(egui::RichText::new("✓ Done").size(9.0).strong().color(egui::Color32::from_rgb(50, 150, 50)));
                    } else {
                        ui.label(egui::RichText::new("○ Pending").size(9.0).color(egui::Color32::BLACK.gamma_multiply(0.5)));
                    }
                    
                    if self.is_locked {
                        ui.label(egui::RichText::new("🔒").size(9.0));
                    }
                });
            });
        });
    }
}
