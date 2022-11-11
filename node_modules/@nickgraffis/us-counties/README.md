## US Counties

Work easily with US Counties from a dataset of all US Counties by `FIPS`, `Name`, and `StateCode`. 

All data is from [USDA Natural Resources Conservation Service](https://www.nrcs.usda.gov/wps/portal/nrcs/detail/national/home/?cid=nrcs143_013697).

### Installation

```bash
npm i @nickgraffis/us-counties
```

_Or use yarn or pnpm_.

### Useage

#### Get County By Name - Includes
```js
import { getCountyByNameIncludes } from "@nickgraffis/us-counties"

getCountyByNameIncludes('Los')
/*
* [
*   {
*     name: 'Los Angeles',
*     FIPS: '64723',
*     state: 'CA'
*   }
* ]
*/
```

#### Get County By Name - Starts With
```js
import { getCountyByNameStartsWith } from "@nickgraffis/us-counties"

getCountyByNameStartsWith('Los')
/*
* [
*   {
*     name: 'Los Angeles',
*     FIPS: '64723',
*     state: 'CA'
*   }
* ]
*/
```

#### Get County By FISP
```js
import { getCountyByFips } from "@nickgraffis/us-counties"

getCountyByFips('64723')
/*
* {
*   name: 'Los Angeles',
*   FIPS: '64723',
*   state: 'CA'
* }
*/
```

#### Get County By State
```js
import { getCountyByState } from "@nickgraffis/us-counties"

getCountyByState('CA')
/*
* [
*   {
*     name: 'Los Angeles',
*     FIPS: '64723',
*     state: 'CA'
*   }
* ]
*/
```

