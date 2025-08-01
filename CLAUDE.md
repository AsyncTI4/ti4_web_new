when creating css styles use css modules when possible, using mantine css variables when applicable
prefer typescript types to interfaces
Avoid React.FC<> when defining component types
do not excessively add inline comments to methods.
jsdoc comments are good, but don't document the 'params' and 'return'
avoid excessive if/else/for loop nesting. more than 2 levels is bad. but even 2 levels is not ideal.
use early return guard clauses liberally to reduce nesting