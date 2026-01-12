export interface RoomInput {
    B: number; // Room Length (cm)
    C: number; // Room Width (cm)
    D: number; // Ceiling Drop (cm)
}

export interface RoomResults {
    H: number; // Low Wall Angle (Perimeter)
    E: number; // Main C Channel (Netsaf)
    F: number; // Furring Channel (Masloul)
    G: number; // Ceiling Hanger (Hangers)
    I: number; // Gypsum Boards
    J: number; // Concrete Screws (Anchor)
    K: number; // Gypsum Screws
    L: number; // Connection Clip (Bakhi Pins)
}

/**
 * STRICT FORMULA IMPLEMENTATION
 * No optimization, no simplification.
 * 
 * Inputs:
 * B = Room Length (cm)
 * C = Room Width (cm)
 * D = Ceiling Drop (cm)
 * 
 * Formulas:
 * H = 2 * (B + C)
 * E = ROUNDUP((((B / 40) - 1) * (C / 300)) + G, 0)
 * F = ROUNDUP((((C / 60) - 1) * (B / 300) * 2) + (H / 300), 0)
 * G = ROUNDUP(((C / 60) - 1) * ((B / 40) - 1) * (D - 5) / 300, 0)
 * I = ROUNDUP((B * C) / (300 * 120), 0)
 * J = (E - G) * 300 / 50
 * K = ROUNDUP(((E - G) + (I - 1) + (H / 300)) * 300 / 15, 0)
 * L = ROUNDUP(((C / 60) - 1) * ((B / 40) - 1) * 6, 0)
 */
export const calculateRoom = (input: RoomInput): RoomResults => {
    const { B, C, D } = input;

    // H = 2 * (B + C)
    const H = 2 * (B + C);

    // G = ROUNDUP(((C / 60) - 1) * ((B / 40) - 1) * (D - 5) / 300, 0)
    // Note: G is needed for E and J and K, so it must be calculated early.
    const G = Math.ceil(((C / 60) - 1) * ((B / 40) - 1) * (D - 5) / 300);

    // E = ROUNDUP((((B / 40) - 1) * (C / 300)) + G, 0)
    const E = Math.ceil((((B / 40) - 1) * (C / 300)) + G);

    // F = ROUNDUP((((C / 60) - 1) * (B / 300) * 2) + (H / 300), 0)
    const F = Math.ceil((((C / 60) - 1) * (B / 300) * 2) + (H / 300));

    // I = ROUNDUP((B * C) / (300 * 120), 0)
    const I = Math.ceil((B * C) / (300 * 120));

    // J = (E - G) * 300 / 50
    // Note: No ROUNDUP specified for J in the prompt text.
    // "J = (E - G) * 300 / 50"
    // If exact numerical match is required, we do not round unless specified.
    const J = (E - G) * 300 / 50;

    // K = ROUNDUP(((E - G) + (I - 1) + (H / 300)) * 300 / 15, 0)
    const K = Math.ceil(((E - G) + (I - 1) + (H / 300)) * 300 / 15);

    // L = ROUNDUP(((C / 60) - 1) * ((B / 40) - 1) * 6, 0)
    const L = Math.ceil(((C / 60) - 1) * ((B / 40) - 1) * 6);

    return { H, E, F, G, I, J, K, L };
};
