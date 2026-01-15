use crate::models::Task;
use chrono::{Datelike, Local, NaiveDate};
use dioxus::prelude::*;

#[component]
pub fn TaskCard(task: Task, on_delete: EventHandler<usize>, on_toggle: EventHandler<usize>) -> Element {
    rsx! {
        div { class: "task-card",
            div { class: "task-title", "{task.title}" }
            div { class: "task-desc", "{task.description}" }
            div { class: "task-meta",
                span { "{task.date.map(|d| d.format(\"%b %d\").to_string()).unwrap_or_default()}" }
                button {
                    class: "delete-btn",
                    onclick: move |_| on_delete.call(task.id),
                    "✖"
                }
            }
        }
    }
}

#[component]
pub fn CalendarWidget(selected_date: Signal<Option<NaiveDate>>) -> Element {
    let now = Local::now().date_naive();
    let current_month = use_signal(|| now); // For navigation (simple version: just current month)
    
    // Simple calendar logic
    let days_in_month = (0..31).map(|d| {
        let d = now.with_day(d + 1);
        d
    }).take_while(|d| d.is_some()).flatten();

    rsx! {
        div { class: "calendar-widget",
            div { class: "calendar-header",
                "{now.format(\"%B %Y\")}"
            }
            div { class: "calendar-grid",
                for day in ["S", "M", "T", "W", "T", "F", "S"] {
                    div { class: "calendar-day-header", "{day}" }
                }
                // Offset matching not implemented for brevity, showing list of days
                // Real calendar would calculate start_weekday
                for day in days_in_month {
                    div {
                        class: if Some(day) == *selected_date.read() { "calendar-day active" } else { "calendar-day" },
                        onclick: move |_| {
                            let mut date = selected_date;
                            if *date.read() == Some(day) {
                                *date.write() = None; // Toggle off
                            } else {
                                *date.write() = Some(day);
                            }
                        },
                        "{day.day()}"
                    }
                }
            }
        }
    }
}

#[component]
pub fn FloatingButton(on_click: EventHandler<()>) -> Element {
    rsx! {
        button {
            class: "fab",
            onclick: move |_| on_click.call(()),
            "+"
        }
    }
}

#[component]
pub fn NewTaskModal(on_close: EventHandler<()>, on_create: EventHandler<(String, String)>) -> Element {
    let mut title = use_signal(|| String::new());
    let mut desc = use_signal(|| String::new());

    rsx! {
        div { class: "modal-overlay",
            onclick: move |_| on_close.call(()), // Close on background click
            div {
                class: "modal-content",
                onclick: |e| e.stop_propagation(), // Stop close when clicking content
                h3 { "New Task" }
                input {
                    placeholder: "What needs to be done?",
                    value: "{title}",
                    oninput: move |e: FormEvent| title.set(e.value())
                }
                textarea {
                    rows: "3",
                    placeholder: "Details...",
                    value: "{desc}",
                    oninput: move |e: FormEvent| desc.set(e.value())
                }
                button {
                    class: "btn-primary",
                    onclick: move |_| {
                         if !title.read().is_empty() {
                             on_create.call((title.read().clone(), desc.read().clone()));
                         }
                    },
                    "Add Pin"
                }
            }
        }
    }
}
