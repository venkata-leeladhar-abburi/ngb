import base from "@ngb/config/eslint/base";

// The token guard is intentionally not applied here: this is the one package allowed raw values.
export default [...base, { ignores: ["dist/**"] }];
