use serde::{Deserialize, Serialize};
use std::time::{Duration, Instant};

#[derive(Serialize, Deserialize, Default)]
pub struct TimerState {
    pub duration_secs: u64,
    pub remaining_secs: u64,
    pub is_running: bool,
    #[serde(default)]
    pub show_popup: bool,
    #[serde(skip)]
    pub last_tick: Option<Instant>,
}

impl TimerState {
    pub fn update(&mut self) -> bool {
        if !self.is_running {
            self.last_tick = None;
            return false;
        }

        let now = Instant::now();
        if let Some(last) = self.last_tick {
            if now.duration_since(last) >= Duration::from_secs(1) {
                if self.remaining_secs > 0 {
                    self.remaining_secs -= 1;
                } else {
                    self.is_running = false;
                }
                self.last_tick = Some(now);
                return true;
            }
        } else {
            self.last_tick = Some(now);
        }
        false
    }

    pub fn start(&mut self, minutes: u64) {
        let secs = minutes * 60;
        self.duration_secs = secs;
        self.remaining_secs = secs;
        self.is_running = true;
        self.show_popup = true;
        self.last_tick = Some(Instant::now());
    }

    pub fn stop(&mut self) {
        self.is_running = false;
        self.show_popup = false;
    }
}
