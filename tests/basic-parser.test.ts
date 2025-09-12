import { z, ZodError } from "zod";
import { parseCSV } from "../src/basic-parser";
import * as path from "path";

const PEOPLE_CSV_PATH = path.join(__dirname, "../data/people.csv");
export const PersonRowSchema = z.tuple([z.string(), z.coerce.number()])
                         .transform( tup => ({name: tup[0], age: tup[1]}))

test("parseCSV yields arrays () no schema", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, undefined)
  if(!(results instanceof ZodError)){
    expect(results).toHaveLength(5);
    expect(results[0]).toEqual(["name", "age"]);
    expect(results[1]).toEqual(["Alice", "23"]);
    expect(results[2]).toEqual(["Bob", "thirty"]); // why does this work? :(
    expect(results[3]).toEqual(["Charlie", "25"]);
    expect(results[4]).toEqual(["Nim", "22"]);
}
});

test("parseCSV yields only arrays", async () => {
  const results = await parseCSV(PEOPLE_CSV_PATH, undefined)
  if(!(results instanceof ZodError)){
    for(const row of results) {
      expect(Array.isArray(row)).toBe(true);
    }
  }
});

const VALID_PEOPLE_PATH = path.join(__dirname, "../data/valid_people.csv");
const INVALID_PEOPLE_PATH = path.join(__dirname, "../data/invalid_people.csv");

describe("parseCSV without schema", () => {
  test("returns arrays of strings", async () => {
    const result = await parseCSV(PEOPLE_CSV_PATH, undefined);

    // should just be string[][]
    expect(Array.isArray(result)).toBe(true);
    if (Array.isArray(result)) {
      expect(result).toHaveLength(5);
      expect(result[0]).toEqual(["name", "age"]);
      expect(result[1]).toEqual(["Alice", "23"]);
      expect(result[2]).toEqual(["Bob", "thirty"]); // no schema, still ok
    }
  });
});

describe("parseCSV with schema", () => {
  test("returns parsed objects when valid", async () => {
    const result = await parseCSV(VALID_PEOPLE_PATH, PersonRowSchema);

    expect(result).not.toBeInstanceOf(ZodError);
    if (!(result instanceof ZodError)) {
      expect(result).toHaveLength(3);
      expect(result[0]).toEqual({ name: "Alice", age: 30 });
      expect(result[1]).toEqual({ name: "Bob", age: 25 });
    }
  });

  test("returns a ZodError when invalid", async () => {
    const result = await parseCSV(INVALID_PEOPLE_PATH, PersonRowSchema);

    expect(result instanceof ZodError);
    if (result instanceof ZodError) {
      expect(result.issues.length).toBeGreaterThan(0);
      expect(result.issues[0].message).toBeDefined();
    }
  });
});