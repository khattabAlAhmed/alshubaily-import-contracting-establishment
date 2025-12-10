import * as authSchema from "./auth-schema";
import * as academySchema from "./academy-schema";

export const schema = {
    ...authSchema,
    ...academySchema,
}