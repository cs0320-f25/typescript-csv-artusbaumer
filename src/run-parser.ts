import { ZodError } from "zod";
import { parseCSV } from "./basic-parser";

/*
  Example of how to run the parser outside of a test suite.
*/

const DATA_FILE = "./data/people.csv"; // update with your actual file name

async function main() {
  // Because the parseCSV function needs to "await" data, we need to do the same here.
  const results = await parseCSV(DATA_FILE, undefined)

  // Notice the difference between "of" and "in". One iterates over the entries, 
  // another iterates over the indexes only.
  if(results instanceof ZodError){
    return results
  }else{
    
    for(const record of results)
      console.log(record)
    for(const record in results)
      console.log(record)
  }
}

main();