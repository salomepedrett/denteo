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

const logDates      = slots => console.log(slots.map(x => ({from: x.from.toISO(), to: x.to.toISO()})))
const parseDateTime = (string) => DateTime.fromISO(string, { zone: "Europe/Paris"})

const searchRange = { from: parseDateTime("2021-01-04"), to: parseDateTime("2021-01-07").plus({days: 1})};
const days        = Interval.fromDateTimes(searchRange.from, searchRange.to).splitBy({ day: 1 }).map(d => d.start);
console.log("days")
console.log(days)

const weeklyAppointments = [
  { from: parseDateTime("2021-01-04T10:15:00"), to: parseDateTime("2021-01-04T10:30:00") },
  { from: parseDateTime("2021-01-05T11:00:00"), to: parseDateTime("2021-01-05T11:30:00") },
  { from: parseDateTime("2021-01-05T15:30:00"), to: parseDateTime("2021-01-05T16:30:00") },
  { from: parseDateTime("2021-01-06T10:00:00"), to: parseDateTime("2021-01-06T10:30:00") },
  { from: parseDateTime("2021-01-06T11:00:00"), to: parseDateTime("2021-01-06T12:30:00") },
  { from: parseDateTime("2021-01-06T17:30:00"), to: parseDateTime("2021-01-06T18:00:00") },
];

console.log("weeklyAppointments")
console.log(weeklyAppointments)

const DAY_START_HOUR   = 8;
const DAY_END_HOUR     = 18;
const LUNCH_START_HOUR = 12;
const LUNCH_END_HOUR   = 13;

const toDateString    = datetime => datetime.toFormat("yyyy-MM-dd")
const getAppointments = (day) => weeklyAppointments.filter(x => toDateString(x.from) == toDateString(day))

const splitDayIntoSlots = (day) => {
  const dayStart    = day.plus({ hours: DAY_START_HOUR })
  const dayEnd      = day.plus({ hours: DAY_END_HOUR })
  const dayDuration = dayEnd.diff(dayStart).milliseconds / 1000   // in seconds
  console.log("dayDuration")
  console.log(dayDuration)

  const starts = [ ...Array(dayDuration).keys() ]                 // seconds from start to end of day: [0, 1, 2, 3, ..., 35999]
    .filter(x => x % 1800 == 0)                                   // take seconds that are divisible by 1800 (1800 seconds = 30 minutes): [0, 1800, 3600, ...]
    .map(x => dayStart.plus({ seconds: x }))                      // convert to absolute datetime again

  const slots = starts.map(x => ({ from: x, to: x.plus({seconds: 1800}) }))
  return slots
}


const slotIsFree = (slot, blocks) => {
   const overlappings = blocks.filter(block => (slot.from < block.to) && (slot.to > block.from ))
   return overlappings.length == 0
}

const findFreeTimeslotsForOneDay = (day) => {
  const appointments = getAppointments(day)
  const lunch        = { from: day.plus({ hours: LUNCH_START_HOUR }), to: day.plus({ hours: LUNCH_END_HOUR }) }
  const blocks       = appointments.concat([lunch]).sort((a,b) => a.from - b.from)
  const slots        = splitDayIntoSlots(day)
  console.log("slots")
  console.log(slots)
  const freeSlots    = slots.filter(slot => slotIsFree(slot, blocks))
  return freeSlots
}

const findFreeTimeslots = () => days.map(x => findFreeTimeslotsForOneDay(x)).flat(1)

const freeSlots = findFreeTimeslots();

export default {
  name: "Slots",
  data() {
    return {
      slots: freeSlots
    }
  },
  components: {
    Slot
  }
}

</script>
