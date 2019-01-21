# [Unreleased]

# v1.0.2: Missed extend, and fixed error for non-existing data in the msg

-  #2: Added missed dependency _extend_ in _package.json_
-  #3: Fixed the _Internal Server Error_ when trying to access to a non-existing field in the _msg_. Althought it was an error in this software, it's related to https://github.com/node-red/node-red/issues/2034
-  Skip to show empty entries (object without any key)

# v1.0.1: Grouped data per event and added "main" attribute into package.json

-  Changed the way of printing the data, grouping all the data in a single message instead of producing a message per data
-  #1: Added _main_ attribute into the _package.json_

# v1.0.0: Initial version

- First implementation
