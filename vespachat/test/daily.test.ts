import { Schedule } from "../src/lib/model/schedule";
import { DailyMessage, fromSchedule } from "../src/lib/msg/daily";

const createTask = (id: number, flags: string) => ({
    id: `id-${id}`,
    description: `description ${id}`,
    flags
})

const createRecipe = (id: number, flags: string) => ({
    id: `id-${id}`,
    description: `Recipe ${id}`,
    link: `http://website.com/${id}`,
    flags
})

test('Convert from schedule', () => {
    const schedule: Schedule = {
        date: '2011-11-10',
        date_human: 'Nov 10',
        casual_tasks: [
            createTask(1, "Daily")
        ],
        occasional_tasks: [
            createTask(2, "Yearly")
        ],
        shopping: [
            createTask(3, "")
        ],
        events: [
            createTask(4, "")
        ],
        lunch: createRecipe(10, ''),
        supper: createRecipe(11, '')
    }
    const expected: DailyMessage = {
        title: "Today Nov 10",
        lunch: "*Lunch*: Recipe 10\n<http://website.com/10|lunch recipe>",
        supper: "*Supper*: Recipe 11\n<http://website.com/11|supper recipe>",
        casual_tasks: [{
            title: 'description 1',
            value: 'id-1'
        }],
        occasional_tasks: [{
            title: 'description 2',
            value: 'id-2'
        }],
        shopping: [{
            title: 'description 3',
            value: 'id-3'
        }],
        events: [{
            title: 'description 4',
            value: 'id-4'
        }]
    }
    const actual = fromSchedule(schedule)
    expect(actual).toEqual(expected)
});