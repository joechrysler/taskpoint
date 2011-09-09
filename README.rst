TaskPoint
=========

TastPoint is a Node.js web app for giving points and assignees to tasks, then keeping score based on what is done.

Dependences
-----------

* Express_
* Jade_
* Stylus_
* `socket.io`_
* `socket.io-client`_ (optional)

.. _Express: http://expressjs.com/index.html
.. _Jade: https://github.com/visionmedia/jade
.. _Stylus: https://github.com/LearnBoost/stylus
.. _`socket.io`: https://github.com/LearnBoost/socket.io
.. _`socket.io-client`: https://github.com/LearnBoost/socket.io-client

To install these dependencies with npm_::

    cd taskpoint
    npm install -d

.. _npm: https://github.com/isaacs/npm

Running
-------

TaskPoint can be run from the command line with::

    node app.js settings.json data.json

Once it's running, point your browser at ``http://localhost:3000`` (unless you've configured it differently in 
``settings.json``).

Settings
--------

Three settings are respected:

- **host**: The host where the server runs. This will be used by the client-side JavaScript to connect to the
  server.
- **port**: The port on which to serve. This is helpful for running multiple instances.
- **allowAdding**: If you don't want other people adding tasks through the web interface, set to ``false``. Default
  is ``true``.

Using
-----

If you've allowed adding new tasks, just click the "Add Task" button on the web interface and fill out the form. (If
you've disabled adding tasks through the web interface, you'll have to edit the ``data.json`` file before running the
server. See ``data.json`` for an example of how to structure the data.) When you're done, click "Add Task" again to
add the task to the To Do list. Clicking "Done" on a task will move it to the Done list and give points to the
assignees. The first assignee on the list gets the full amount of points, the second assignee gets half the points,
the third gets a third of the points, and so on. To undo an task, click "Not Done". This will move the task back to
the To Do list and take points away from the assignees.

Contributing
============

Feel free to fix any bugs, add features, whatever you want! Here's a starter list of things that can be done:

- Make the title configurable.
- User authentication.
- Permissions.