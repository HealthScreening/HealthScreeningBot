!!! warning
    The site has moved to http://pokestarfan.ga/. This site will no longer be updated.

# New Queue System

I am happy to announce that today I have released a **queue system** for the health screening bot! This is designed to
prevent crashes when too many simulatenously call the bot in the morning. The queue works like this: only 4 screenings
can run at a time, and any additional screenings will require one of those 4 slots to be freed up. If your screening
gets sent to the queue, you will be notified.

# Auto Screenings

Auto screenings will now be done 4 at a time in order to improve speed. This will most likely cause anyone trying to
generate a screening in the morning to run into the queue, but I promise this will be much better once the bot is
quarantined by Discord.
