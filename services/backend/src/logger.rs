use {pretty_env_logger::env_logger::fmt::Color, std::io::Write};

pub struct Logger {}

impl Logger {
    pub fn init() {
        pretty_env_logger::formatted_builder()
            .format(|buf, record| {
                let mut style = buf.style();

                style.set_intense(true).set_bold(true);

                match record.level() {
                    log::Level::Trace => {
                        style.set_color(Color::Cyan);
                    }
                    log::Level::Debug => {
                        style.set_color(Color::Blue);
                    }
                    log::Level::Info => {
                        style.set_color(Color::Green);
                    }
                    log::Level::Warn => {
                        style.set_color(Color::Yellow);
                    }
                    log::Level::Error => {
                        style.set_color(Color::Red);
                    }
                }

                writeln!(buf, "{} - {}", style.value(record.level()), record.args())
            })
            .filter(None, log::LevelFilter::Info)
            .filter(Some("backend"), log::LevelFilter::Trace)
            .init();
    }
}
