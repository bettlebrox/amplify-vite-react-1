import type { Schema } from "../../data/resource";
export const handler: Schema["Hello"]["functionHandler"] = async (event) => {
    const {name} = event.arguments
    console.log(event);
    return `Hello, ${name}`;
};