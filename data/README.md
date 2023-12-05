1. At postgres query tool :
    ```
    CREATE database eventmaster
    ```
2. At terminal:
    ```
    pg_restore -U 'username' -d eventmaster 'PATH/TO/eventmaster.backup'
    ```
eventmaster.back 放在 https://drive.google.com/file/d/1I3o8ZHuPGyMGJMoEKUhacKPbrVsjsvGt/view?usp=sharing