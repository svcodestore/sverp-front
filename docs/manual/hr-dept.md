# 人资部

提供了【关键绩效指标（KPI）】、【前台物料库存管理】功能模块，访问需要相应的授权权限。

**功能结构图：**

```mermaid
graph TD
	 dept([人资部])---mod1>"关键绩效指标（KPI）"]
	 dept([人资部])---mod2>前台物料库存管理]
	 mod2---section1{{用料管理}}
	 mod2---section2{{库存查询}}
	 mod2---section3{{出库/入库}}
	 section3---fun1[/入库管理\]
	 section3---fun2[/出库管理\]
	 section3---fun3[/领料申请\]
```



## 关键绩效指标（KPI）

## 前台物料库存管理

日常使用材料物品管理。

### 用料管理

可建立用料列表、分类，并对其进行添加和编辑管理。

> ![使用](http://192.168.123.51:8088/static/docs/usage/hrd/usedMaterial/2021022214used1.png)

> ![使用](http://192.168.123.51:8088/static/docs/usage/hrd/usedMaterial/2021022214used2.png)

### 库存查询

查看用料库存和库存操作明细

> ![使用](http://192.168.123.51:8088/static/docs/usage/hrd/usedMaterial/2021022214stock1.png)

> ![使用](http://192.168.123.51:8088/static/docs/usage/hrd/usedMaterial/2021022214stock2.png)

### 出库/入库

用料的入库、出库和出库审核。

入库：

> ![使用](http://192.168.123.51:8088/static/docs/usage/hrd/usedMaterial/2021022214inbound1.png)

> ![使用](http://192.168.123.51:8088/static/docs/usage/hrd/usedMaterial/2021022214inbound2.png)

申请审核：

> ![使用](http://192.168.123.51:8088/static/docs/usage/hrd/usedMaterial/2021022214confirm1.png)

> ![使用](http://192.168.123.51:8088/static/docs/usage/hrd/usedMaterial/2021022214confirm2.png)

领料申请：

> ![使用](http://192.168.123.51:8088/static/docs/usage/hrd/usedMaterial/2021022214outbound1.png)
