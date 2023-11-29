type ColorType = "success" | "info" | "error" | "warning" | keyof typeof COLORS;
type ValueOf<T> = T[keyof T];

export default function colorLog(message: string, type?: ColorType) {
  let color: ValueOf<typeof COLORS>;

  switch (type) {
    case "success":
      color = COLORS.FgGreen;
      break;
    case "info":
      color = COLORS.FgBlue;
      break;
    case "error":
      color = COLORS.FgRed;
      break;
    case "warning":
      color = COLORS.FgYellow;
      break;
    default:
      color = COLORS[type];
      break;
  }

  console.log(color, message);
}

const COLORS = {
  Reset: "\u001B[0m",
  Bright: "\u001B[1m",
  Dim: "\u001B[2m",
  Underscore: "\u001B[4m",
  Blink: "\u001B[5m",
  Reverse: "\u001B[7m",
  Hidden: "\u001B[8m",
  FgBlack: "\u001B[30m",
  FgRed: "\u001B[31m",
  FgGreen: "\u001B[32m",
  FgYellow: "\u001B[33m",
  FgBlue: "\u001B[34m",
  FgMagenta: "\u001B[35m",
  FgCyan: "\u001B[36m",
  FgWhite: "\u001B[37m",
  BgBlack: "\u001B[40m",
  BgRed: "\u001B[41m",
  BgGreen: "\u001B[42m",
  BgYellow: "\u001B[43m",
  BgBlue: "\u001B[44m",
  BgMagenta: "\u001B[45m",
  BgCyan: "\u001B[46m",
  BgWhite: "\u001B[47m",
} as const;
