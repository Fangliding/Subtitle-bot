# Subtitle-bot
返回随机台词的 tg inline bot
示例 bot @rabbit_zh_subtitle_test_bot 

## 如何使用

新建一个 telegram bot 获取 token 并打开 inline 模式

新建一个 cloudflare worker 并把 worker.js 复制进去

修改 SECRET TOKEN lines或SOURCE

部署并访问 /registerWebhook (新部署访问一次即可 后续编辑不再需要)

即可食用

## 语料库

可以选择设置 SOURCE 远程引用txt(便于维护) 或者直接赋值到 lines 变量中(懒人部署) 由于可能有上万行所以 var lines 放在js最末尾

格式为 {description}台词 你可以手动编写或者自己编写脚本从字幕文件生成 以下为范例

```
const SOURCE = 'https://fangliding.github.io/Subtitle-bot/rabbit.txt' // 引用远程txt
```

```
var lines=` // 硬编码
{S1E03}很好喝
{S1E03}嗯 我也最喜欢咖啡了
{S1E03}我好像迷上了智乃给我泡的咖啡了
{Dear My Sister S1E03}这是为什么呢
{S1E03}但是心爱不是区分不出咖啡味道有什么差别吗
{S1E03}只是咖啡因中毒而已
{S1E03}居然被当成是咖啡因中毒...
{S1E03}好了 差不多该开店了哦
{S1E01 S1E02 S1E03 S1E04 S1E05 S1E06 S1E08 S1E10 S1E11 S2E01 S2E02 S2E03 S2E06 S2E09 S2E10 S2E11 S2E12 S3E01 S3E04 S3E08 S3E09 Sing For You}好的
{S1E03}Rabbit House的杯子设计很朴素呢
{S1E03}朴素的才是最好的
{S1E03}要是有更多款式大家一定会很高兴的
{S1E03}是这样的吗
{S1E03}之前看到了个很有趣的杯子
{S1E03}大家一起去买吧
{S1E03}咦 什么样的
{S1E03}那个啊 蜡烛闪动着火焰 散发着香气
{S1E03}那不是香薰蜡烛吗
{S1E03}啊 有好多可爱的杯子
{S1E03}不要太兴奋了啊
{S1E03}真是不出所料
`
```