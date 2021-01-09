# Coding Convention

## Front end

### JavaScript Coding Convention

- use two indents
- must remark for complex context statement
- remark for function parameters
- writing in camel case
- use ES6+ syntax
- no more than 800 lines per file
- use eslint,prettier-eslint and prettier-standard-javascript-formatter to format code



### Reusable Code

::: tip
use 「sv-grid」component to collect a table modification operations.The component is a enhance customly table base on `vxe-table`.For more API details please visit vxe-table homepage.
:::

sv-grid component usage:

```vue
<sv-grid ref="svGrid" v-bind="svGridOptions" v-on="svGridEvents"></sv-grid>
<script>
export default {
  data () {
    return {
      svGridOptions: {
        loading: false,
        data: [],
        params: {},
        addItem: {
          defaultValue: { // default added value
            con_status: 0,
            con_is_del: 1,
            con_lang: 'zh_CN'
          },
          focusField: 'con_id' // focus a field after adding
        },
        handleInsert: this.handleInsert, // handle add item format
        handleUpdate: this.handleUpdate, // handle update item format
        editConfig: {
          activeMethod: this.activeCellMethod
        },
        editRules: {
          con_id: [
            { required: true, message: '请输入账号' },
            { pattern: '[0-9a-zA-Z]{4,16}', message: '4-16位字母数字' },
            { validator: this.pwdValidator }
          ],
          con_password: [{ required: true, message: '密码不能为空' }]
        },
        keyboardConfig: {
          editMethod: this.editMethod
        },
        handleSaveOpt: saveUserOpt, // the backend callback function of table modifactions.
        columns: [] // columns
      },
      svGridEvents: {
        refresh: this.refreshTable // refresh table callback function.
      }
    }
  }
}
</script>
```



## Backend

### PHP Coding Convention

- return statement in new line
- declare type
- use strict syntax
- writing in camel case
- use four indents
- must remark for complex context statement
- remark for function parameters

> recommend to use vsc's extension named readable-indent to formmat code if use visual studio code

### Reusable Code

#### app\webApi\model\Common::handleOpt

Handle varialbe $opt from front-end which is edit operation set for same table. With the front-end table control, greatly simplifies the cud coding. The data format of $opt is:

```json
{
    "A": [ // insert 
        { field1: 'value1', field2: 'value2', ... }, // row1
        { field1: 'value1', field2: 'value2', ... } // row2
    ],
    "U": { // update
        "1": { // primary key, default string|int id
            "field1": "value1",
            "field2": "value2"
        },
        "{ \"filed1\": \"value1\", \"field2\": \"value2\" }": { // json string, depends on multi fields
            "field1": "value1",
            "field2": "value2"
        }
    },
    "D": { // delete
        "primary key": // primary key 
        ["1", "2", "3", ...]
    }
}
```



::: warning
Only support to delete which use id field.
:::

```php
/**
  * @description: handle table cud.
  * @param string $tableName table name
  * @param array $opt changed data
  * @return bool
  */
public static function handleOpt(string $tableName, array $opt): bool
{
    Db::startTrans();
    $flag = true;
    foreach ($opt as $optype => $data) {
        if ($optype == 'A') {
            $flag  = $flag && false !== self::hanleInsert($tableName, $data);
        }

        if ($optype == 'U') {
            foreach ($data as $v) {
                $pkVal = array_keys($v)[0];
                $row   = array_values($v)[0];

                // if it is numeric, use default primary key: id.
                if (is_numeric($pkVal)) {
                    $pkVal = ['id' => $pkVal];

                    // otherwise, change to json, use multi field.
                } else {
                    $pkVal = json_decode($pkVal, true);
                }

                $flag  = $flag && false !== self::handleUpdate($tableName, $pkVal, $row);
            }
        }

        if ($optype == 'D') {
            $flag  = $flag && false !== self::handleDelete($tableName, $data['id']);
        }
    }
    if ($flag) {
        Db::commit();
    } else {
        Db::rollback();
    }

    return $flag;
}
```





