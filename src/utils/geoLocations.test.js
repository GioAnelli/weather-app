import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getBrowserLang, sum } from "./geoLocations";

describe(getBrowserLang.name + " method", () => {
    beforeEach(() => {
        Object.defineProperty(navigator, 'languages', {
            value: ['fr-FR', 'en-US'],
            configurable: true,
        });
    })

    it('should return current browser language', () => {
        const result = getBrowserLang()

        expect(result).toEqual('fr-FR')
    })
})

describe(sum.name + " method", () => {

    it("should sum an array of number", () => {
        const result = sum([5,5,5,5,5,5,5,5,5])
        expect(result).toBe(45);
    })
    
    it('should return the only ong given number', () => {
        const result = sum(1)
        expect(result).toBe(1);
    }) 


})