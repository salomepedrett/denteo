<template>
  <div>
    Hello World from Vue-Router
    <br />
    <br />
    <Slot v-for="slot in slots" :slot="slot" />
  </div>
</template>

<script>

import Slot from "./Slot.vue"
import { Interval, DateTime } from "luxon"

const zip = (a1, a2) => a1.map((x, i) => [x, a2[i]]);

const parseDateTime = (string) => DateTime.fromISO(string, { zone: "Europe/Paris"})

const searchRange = { from: parseDateTime("2021-01-04"), to: parseDateTime("2021-01-07").plus({days: 1})};
console.log("searchRange")
console.log(searchRange)

const days = Interval.fromDateTimes(searchRange.from, searchRange.to).splitBy({ day: 1 }).map(d => d.start);
console.log("days")
console.log(days)
console.log(days[0].toISO())
console.log(days[3].toISO())

const day = days[2]
console.log(day)


const weeklyAppointments = [
  { from: parseDateTime("2021-01-04T10:15:00"), to: parseDateTime("2021-01-04T10:30:00") },
  { from: parseDateTime("2021-01-05T11:00:00"), to: parseDateTime("2021-01-05T11:30:00") },
  { from: parseDateTime("2021-01-05T15:30:00"), to: parseDateTime("2021-01-05T16:30:00") },
  { from: parseDateTime("2021-01-06T10:00:00"), to: parseDateTime("2021-01-06T10:30:00") },
  { from: parseDateTime("2021-01-06T11:00:00"), to: parseDateTime("2021-01-06T12:30:00") },
  { from: parseDateTime("2021-01-06T17:30:00"), to: parseDateTime("2021-01-06T18:00:00") },
];

console.log(weeklyAppointments)

const DAY_START_HOUR   = 8;
const DAY_END_HOUR     = 18;
const LUNCH_START_HOUR = 12;
const LUNCH_END_HOUR   = 13;

const to_date_string = datetime => datetime.toFormat("yyyy-MM-dd")
const get_appointments_of_day = (day) => weeklyAppointments.filter(x => to_date_string(x.from) == to_date_string(day))

const split_day_into_slots = (day) => {
  const day_start = day.plus({ hours: DAY_START_HOUR })
  const day_end   = day.plus({ hours: DAY_END_HOUR })

  const duration_of_day = day_end.diff(day_start).milliseconds / 1000 // in seconds

  const starts = [ ...Array(duration_of_day).keys() ] // seconds from start to end of day
    .filter( x => x % 1800 == 0 )                     // 1800 = 30 minutes
    .map( x => day_start.plus({ seconds: x}))         // convert to absolute datetime again

  const slots = starts.map(x => ({from: x, to: x.plus({seconds: 1800})}))

  return slots
}

const display = slots => slots.map(x => ({from: x.from.toISO(), to: x.to.toISO()}))

const slot_is_free = (slot, blocks) => {
   // const overlappings = blocks.filter( block => (slot.from >= block.from && slot.from < block.to) || (slot.to > block.from && slot.to < block.to ))
   const overlappings = blocks.filter( block => (slot.from < block.to) && (slot.to > block.from ) )
   return overlappings.length == 0
}

const find_free_slots = (slots, blocks) => {
   console.log("slots")
   console.log(display(slots))
   console.log("blocks")
   console.log(display(blocks))

   const free_slots = slots.filter(slot => slot_is_free(slot, blocks))
   return free_slots
}


const findFreeTimeslotsForOneDay = (day) => {
  const appointments = get_appointments_of_day(day)
  const lunch        = { from: day.plus({ hours: LUNCH_START_HOUR }), to: day.plus({ hours: LUNCH_END_HOUR })}
  const blocks       = appointments.concat([lunch]).sort((a,b) => a.from - b.from)
  const slots        = split_day_into_slots(day)
  const free_slots   = find_free_slots(slots, blocks)
  return free_slots
}

console.log("free slots")
console.log(display(findFreeTimeslotsForOneDay(day)))


const findFreeTimeslots = () => days.map(x => findFreeTimeslotsForOneDay(x)).flat(1)
console.log(display(findFreeTimeslots()))

const free_slots = findFreeTimeslots();

export default {
  name: "Slots",
  data() {
    return {
      slots: free_slots
    }
  },
  components: {
    Slot
  }
}

</script>
