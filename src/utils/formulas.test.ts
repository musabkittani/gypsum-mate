import { describe, it, expect } from 'vitest';
import { calculateRoom } from './formulas';

describe('Gypsum Formulas', () => {
    it('calculates correctly for a standard room', () => {
        // Example: 4m x 5m room, 50cm drop
        const result = calculateRoom({ B: 400, C: 500, D: 50 });

        expect(result.H).toBe(1800);
        expect(result.G).toBe(10);
        expect(result.E).toBe(25);
        expect(result.F).toBe(26);
        expect(result.I).toBe(6);
        expect(result.J).toBe(90);
        expect(result.K).toBe(520);
        expect(result.L).toBe(396);
    });

    it('matches the User Provided Excel Screenshot (400x300, Drop 20)', () => {
        // Inputs from screenshot: B=400, C=300, D=20
        // Expected Results from screenshot:
        // H=1400, E=11, F=16, G=2, I=4
        // J=54, K=334, L=216

        const result = calculateRoom({ B: 400, C: 300, D: 20 });

        expect(result.H).toBe(1400);
        expect(result.G).toBe(2);
        expect(result.E).toBe(11);
        expect(result.F).toBe(16);
        // Note: I=4 in Excel. My previous manual formula check:
        // I = CEIL(400*300 / 36000) = CEIL(120000/36000) = CEIL(3.33) = 4. Correct.
        expect(result.I).toBe(4);

        // J in Excel is 54. 
        // My formula: (E-G)*300/50 = (11-2)*6 = 54. Correct.
        expect(result.J).toBe(54);

        // K in Excel is 334.
        // My formula: CEIL(((E-G)+(I-1)+(H/300))*20)
        // = CEIL(((9)+(3)+(4.666))*20) = CEIL(16.666*20) = 334. Correct.
        expect(result.K).toBe(334);

        // L in Excel is 216.
        // Formula: CEIL(((300/60)-1)*((400/40)-1)*6) = CEIL(4*9*6) = 216. Correct.
        expect(result.L).toBe(216);
    });
});
