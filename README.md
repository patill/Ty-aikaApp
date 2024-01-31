# About

![TyöaikaApp icon](apple-touch-icon.png)

TyöaikaApp is a simple application to track personal working hours.
It runs only locally on the device and stores all information on
the device itself.

The app is hosted on a [github page](https://patill.github.io/Tyo-aikaApp/)
accompanied with this repository,
from where it can be used. The app uses PWA-technologies to install
a copy of itself on the user's device, but in fact it is only a webpage.

If there is need to stop your working day but the saldo should not be updated
(if you get sick during the day e.g.) you don't press the ULOS button,
and that day's saldo will be automatically be zero.

On the next working day your status will still be "Logged in", so you
have to press first OUT and the IN. The OUT record before the first IN
record on the same day will not be counted.

# Features

The interface is only in Finnish at the moment.

The app features keeping track of working day starting and ending times,
which can be registerd by clicking SISÄÄN or ULOS. The third button
(Oma asia ulos) is used if you have to leave your work in the middle
of the day but you will come back later, and if the time you will be on
the leave is your private time. When coming back just hit the SISÄÄN
button again and the app will exclude the time between when you left
work and came back from your working hours.

## Settings

The Asetukset button opens the settings menu.
You can assign your name, your normal daily working hours and the
saldo you already have when you start using the app (positive or
negative).
If you to a mistake and want to corret it you can use the correction
button (Korjaa kirjaus). You can only add records with the correction
button, not delete them.
You can save your logs as a JSON file onto your device to transfer it,
and you can import the saved data again into the app.

## Sharing

The app provides a sharing button on mobile devices which lets you share
your logs with another person. The shared data is in CSV format.

# Technical

The working principle of the app is that it takes the first IN record
and the last OUT record of one day and calculates the time inbetween.
If there has been clicked Oma asia ulos (OAU) then it will look for the
next IN record after the OAU record, calculate the time inbetween the
both and subtract it from your work day. According to the daily hours
set in the settings the app calculates if your actual working day is
longer or shorter than what it should be and calulates your daily saldo.
The saldo is then summed up from all days and shown as your working saldo.

Your data is saved in local store of the browser being used. The data
can be erased in rare cases after system or browser updates. Keep a
backup of your data to avoid data loss.

# Todo

It should be possible to not only add but also remove log records with
the correction button.

The app should show logged out status in the morning automatically. This
is not easily achieved since the PWA can stay all the time in the RAM
of the device and thus it won't be updated when the user opens the
app again. It would be maybe possible to track the focus of the app
and initiate a reload, together with which there could be also checked
the hour of the day.

The data should be safe. This is virtually impossible since the data is
contained only locally and it is up to the user to initiate a backup.
PWA and browser sandboxing prevents backup functionality to happen automatically
on the user's device.
