mod app;
mod pin;
mod timer;
use app::AppState;
use eframe::egui;

fn main() -> eframe::Result<()> {
    #[cfg(target_os = "linux")]
    {
        if gtk::init().is_err() {
            eprintln!("Failed to initialize GTK.");
        }
    }

    let native_options = eframe::NativeOptions {
        viewport: egui::ViewportBuilder::default()
            .with_always_on_top()
            .with_transparent(true)
            .with_decorations(true)
            .with_inner_size([450.0, 750.0])
            .with_min_inner_size([400.0, 400.0]),
        ..Default::default()
    };

    eframe::run_native(
        "Pin-Board",
        native_options,
        Box::new(|cc| {
            Ok(Box::new(AppState::new(cc)))
        }),
    )
}
