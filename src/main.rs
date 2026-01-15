#![allow(non_snake_case)]

mod components;
mod models;

use crate::components::{CalendarWidget, FloatingButton, NewTaskModal, TaskCard};
use crate::models::Task;
use chrono::{Local, NaiveDate};
use dioxus::prelude::*;

const STYLE: &str = include_str!("../assets/style.css");

fn main() {
    dioxus::launch(App);
}

fn App() -> Element {
    let mut tasks = use_signal(|| vec![
        Task::new(1, "Welcome".to_string(), "This is your new Pin Board. Add tasks using the button below.".to_string(), Some(Local::now().date_naive())),
    ]);
    let mut show_modal = use_signal(|| false);
    let mut selected_date = use_signal(|| Option::<NaiveDate>::None);

    let filtered_tasks = tasks.read().iter().filter(|t| {
        if let Some(date) = *selected_date.read() {
            t.date == Some(date)
        } else {
            true // Show all if no date selected
        }
    }).cloned().collect::<Vec<_>>();

    let add_task = move |(title, desc): (String, String)| {
        let mut current_tasks = tasks.write();
        let id = current_tasks.len() + 1;
        let date = *selected_date.read(); // Default to selected date or None (maybe should default to today if None? User choice)
        let date = date.or_else(|| Some(Local::now().date_naive())); 
        
        current_tasks.push(Task::new(id, title, desc, date));
        show_modal.set(false);
    };

    let delete_task = move |id| {
        tasks.write().retain(|t| t.id != id);
    };

    rsx! {
        style { "{STYLE}" }
        div { id: "app",
            div { class: "sidebar",
                h2 { "My Board" }
                CalendarWidget { selected_date: selected_date }
                div { 
                    style: "margin-top: auto; color: var(--text-muted); font-size: 0.8rem;",
                    "Total Pins: {tasks.read().len()}"
                }
            }
            div { class: "pin-board",
                for task in filtered_tasks {
                    TaskCard { 
                        key: "{task.id}", 
                        task: task, 
                        on_delete: delete_task,
                        on_toggle: |_| {} // Todo: implement toggle if needed
                    }
                }
            }
            FloatingButton { on_click: move |_| show_modal.set(true) }
            
            if *show_modal.read() {
                NewTaskModal {
                    on_close: move |_| show_modal.set(false),
                    on_create: add_task
                }
            }
        }
    }
}
