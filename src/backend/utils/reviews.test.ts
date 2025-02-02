/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { FORGETTING_CURVE } from "../../shared/constants";
import { getNextReviewTime } from "./reviews";

describe("getNextReviewTime", () => {
    it("should calculate next review time based on proficiency level and last submission time", () => {
        const mockDate = "1738300441155";
        const testCases = [
            { proficiency: 0, expectedMinutes: FORGETTING_CURVE[0] },
            { proficiency: 1, expectedMinutes: FORGETTING_CURVE[1] },
            { proficiency: 2, expectedMinutes: FORGETTING_CURVE[2] },
        ];

        testCases.forEach(({ proficiency, expectedMinutes }) => {
            const problemProficiency = {
                lastSubmissionTime: mockDate,
                proficiency,
            };

            const result = getNextReviewTime(problemProficiency);

            console.log(result);

            const expectedTime = new Date(parseInt(mockDate) + expectedMinutes * 60 * 1000)
                .getTime()
                .toString();

            expect(result).toBe(expectedTime);
        });
    });
});
