use chrono::{DateTime, Local, NaiveDate};
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, PartialEq, Serialize, Deserialize)]
pub struct Task {
    pub id: usize,
    pub title: String,
    pub description: String,
    pub date: Option<NaiveDate>,
    pub completed: bool,
    pub created_at: DateTime<Local>,
}

impl Task {
    pub fn new(id: usize, title: String, description: String, date: Option<NaiveDate>) -> Self {
        Self {
            id,
            title,
            description,
            date,
            completed: false,
            created_at: Local::now(),
        }
    }
}
