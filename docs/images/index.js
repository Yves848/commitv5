import path from 'path';
import fs from 'fs';

import backgroundImage01 from './background01.jpg';
import backgroundImage02 from './background02.jpg';
import backgroundImage03 from './background03.jpg';
import backgroundImage04 from './background04.jpg';
import backgroundImage05 from './background05.jpg';
import backgroundImage06 from './background06.jpg';
import backgroundImage07 from './background07.jpg';
import backgroundImage08 from './background08.jpg';
import backgroundImage09 from './background09.jpg';
import backgroundImage10 from './background10.jpg';
import backgroundImage11 from './background11.jpg';
import backgroundImage12 from './background12.jpg';
import backgroundImage13 from './background13.jpg';
import backgroundImage14 from './background14.jpg';
import backgroundImage15 from './background15.jpg';
import backgroundImage16 from './background16.jpg';
import backgroundImage17 from './background17.jpg';

const images = [
  backgroundImage01,
  backgroundImage02,
  backgroundImage03,
  backgroundImage04,
  backgroundImage05,
  backgroundImage06,
  backgroundImage07,
  backgroundImage08,
  backgroundImage09,
  backgroundImage10,
  backgroundImage11,
  backgroundImage12,
  backgroundImage13,
  backgroundImage14,
  backgroundImage15,
  backgroundImage16,
  backgroundImage17
];

const imagenb = Math.floor(Math.random() * Math.floor(images.length-1));
export const backgroundImg = images[imagenb];
