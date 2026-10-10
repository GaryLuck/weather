import test from 'node:test';
import assert from 'node:assert/strict';
import {birthdayDays,easternDate,skyAt,weatherDescription} from '../model.js';
test('birthday is today on April 22, tomorrow on April 21, and next year after April 22',()=>{
 assert.equal(birthdayDays({year:2026,month:4,day:22}),0);
 assert.equal(birthdayDays({year:2026,month:4,day:21}),1);
 assert.equal(birthdayDays({year:2026,month:4,day:23}),364);
 assert.equal(birthdayDays({year:2027,month:4,day:23}),365);
});
test('calendar countdown crosses daylight saving without losing a day',()=>assert.equal(birthdayDays({year:2026,month:3,day:7}),46));
test('date and clock use Germantown time even before UTC midnight',()=>assert.deepEqual(easternDate(new Date('2026-04-22T02:30:00Z')),{year:2026,month:4,day:21,minutes:1350}));
test('sky transitions smoothly through all selectable minutes',()=>{
 for(let m=0;m<1440;m++){const sky=skyAt(m);assert.match(sky.top,/^rgb\(\d+,\d+,\d+\)$/);assert.ok(sky.label);}
 assert.equal(skyAt(0).night,true);assert.equal(skyAt(720).night,false);assert.notEqual(skyAt(720).top,skyAt(0).top);
});
test('weather codes include rain, snow, storms, and unknown values',()=>{assert.equal(weatherDescription(63),'Rain');assert.equal(weatherDescription(73),'Snow');assert.equal(weatherDescription(95),'Thunderstorms');assert.equal(weatherDescription(-1),'Weather unavailable');});
