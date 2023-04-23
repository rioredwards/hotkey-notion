import chalk from "chalk";
import { countCharsWithEmojis } from "./emojis.js";

type CellPos = "first" | "center" | "last";

const ROW_COLOR_1 = "#2323232a";
const ROW_COLOR_2 = "#2c2c2c2a";

const horizontalLine = "─";
const verticalLine = "│";
const topLeftCorner = "┌";
const topRightCorner = "┐";
const bottomLeftCorner = "└";
const bottomRightCorner = "┘";
const topSeperator = "┬";
const bottomSeperator = "┴";
const padding = " ".repeat(2);

const MAX_WIDTH_PER_COLUMN = [16, 16, 80];

function customPadEnd(str: string, length: number, fill: string = " ") {
  const chars = countCharsWithEmojis(str);
  return str + fill.repeat(length - chars);
}

function getColumns(table: string[][]) {
  return table[0].map((_, i) => table.map((row) => row[i]));
}

function truncate(str: string, nun: number) {
  return countCharsWithEmojis(str) > nun
    ? str.substring(0, nun - 3) + "..."
    : str;
}

function truncateCells(table: string[][]) {
  return table.map((row) =>
    row.map((cell, i) => truncate(cell, MAX_WIDTH_PER_COLUMN[i]))
  );
}

function getColumnMaxWidths(columns: string[][]) {
  const colMaxWidths = columns.map((column) => {
    return Math.max(...column.map((cell) => countCharsWithEmojis(cell)));
  });

  return colMaxWidths;
}

function formatTable(table: string[][], colWidths: number[]) {
  const formattedTable = table.map((row, i) => {
    const color = i % 2 === 0 ? ROW_COLOR_1 : ROW_COLOR_2;
    const formattedRow = formatRow(row, colWidths, color);
    return formattedRow.join("");
  });

  return formattedTable;
}

function formatRow(row: string[], colWidths: number[], color: string) {
  const formattedRow = row.map((cell, i) => {
    const cellPos =
      i === 0 ? "first" : i === row.length - 1 ? "last" : "center";
    let formattedCell = customPadEnd(cell, colWidths[i]);
    let coloredCells = "";

    switch (cellPos) {
      case "first":
        coloredCells = chalk.bgHex(color)(padding + formattedCell + padding);
        return verticalLine + coloredCells;

      case "last":
        coloredCells = chalk.bgHex(color)(padding + formattedCell + padding);
        return coloredCells + verticalLine;

      default:
        coloredCells = chalk.bgHex(color)(
          verticalLine + padding + formattedCell + padding + verticalLine
        );
        return coloredCells;
    }
  });
  return formattedRow;
}

export function drawTable(table: string[][]) {
  // Clear screen
  console.log("\n".repeat(25));

  const trimmedCells = table.map((row) => row.map((cell) => cell.trim()));
  const truncatedCells = truncateCells(trimmedCells);
  const columns = getColumns(truncatedCells);
  const columnWidths = getColumnMaxWidths(columns);
  const formattedTable = formatTable(truncatedCells, columnWidths);

  const formattedWidths = columnWidths.map((_, i) => {
    if (i === 0 || i === columnWidths.length - 1) {
      return columnWidths[i] + padding.length * 2 + verticalLine.length;
    } else {
      return columnWidths[i] + padding.length * 2 + verticalLine.length * 2;
    }
  });

  const topRow =
    topLeftCorner +
    formattedWidths
      .map((width, i) => {
        if (i === 0) return horizontalLine.repeat(width - 1);
        else if (i === formattedWidths.length - 1)
          return horizontalLine.repeat(width - 1);
        else return horizontalLine.repeat(width - 2);
      })
      .join(topSeperator) +
    topRightCorner;

  const bottomRow =
    bottomLeftCorner +
    formattedWidths
      .map((width, i) => {
        if (i === 0) return horizontalLine.repeat(width - 1);
        else if (i === formattedWidths.length - 1)
          return horizontalLine.repeat(width - 1);
        else return horizontalLine.repeat(width - 2);
      })
      .join(bottomSeperator) +
    bottomRightCorner;

  // Print table
  console.log(topRow);
  formattedTable.forEach((row) => {
    console.log(row);
  });
  console.log(bottomRow);
}
