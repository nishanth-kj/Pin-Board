use wasm_bindgen::prelude::*;
use pulldown_cmark::{Parser, Options, html};

#[wasm_bindgen]
pub fn convert_markdown_to_html(markdown_input: &str) -> String {
    let mut options = Options::empty();
    options.insert(Options::ENABLE_STRIKETHROUGH);
    options.insert(Options::ENABLE_TABLES);
    
    let parser = Parser::new_ext(markdown_input, options);
    let mut html_output = String::new();
    html::push_html(&mut html_output, parser);
    
    html_output
}
