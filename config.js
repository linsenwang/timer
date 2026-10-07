// ============================================================
//  跑步训练计划 —— 只改这个文件，不用动 index.html
//  改完保存，刷新页面即生效（手机上的 Chrome app 拉一下刷新即可）
// ============================================================
//
//  一条动作（items 里的一项）可以写这些字段，都可以省略：
//    name      动作名，计时器上的大字
//    detail    动作说明，名字下面那行小字，例如「左侧 (大腿前侧)」
//    reps      每组做几次。写了就是按次数计时，计时器会跟着节奏滴声报数
//    interval  每下几秒，配合 reps 用；省略时按 1 秒
//    sets      这条动作整组重复几遍，组间休息用所属分类的 rest；省略时按 1 遍
//    duration  按秒计时时这一条做多少秒；省略时用所属分类的 work
//
//  一个分类（categories 里的一项）可以写这些字段：
//    key       分类标识，随便起，别重复
//    label     按钮上的中文名
//    icon      按钮上的 emoji
//    work      这个分类里每条动作的默认秒数
//    rest      动作之间休息多少秒
//
//  顶部的默认值：
//    appTitle         浏览器标签 / 页面标题
//    defaultCategory  打开时默认选中哪个分类（写分类的 key）
//    prep             开始前那段准备时间
//
//  加一个分类就会自动多一个按钮，不需要改别的地方。

window.TIMER_CONFIG = {
  appTitle: '跑步训练流程控制器',
  defaultCategory: 'strength',

  prep: { name: '准备开始', detail: '调整呼吸', duration: 3 },

  categories: [
    {
      key: 'activation',
      label: '跑前激活',
      icon: '🔥',
      work: 30,
      rest: 3,
      items: [
        { name: '站姿侧抬腿', detail: '左侧', reps: 15, interval: 1.2 },
        { name: '站姿侧抬腿', detail: '右侧', reps: 15, interval: 1.2 },
        { name: '靠墙静蹲', detail: '' }
      ]
    },
    {
      key: 'stretch',
      label: '跑后拉伸',
      icon: '🧘',
      work: 45,
      rest: 10,
      items: [
        { name: '股四头肌拉伸', detail: '左侧 (大腿前侧)' },
        { name: '股四头肌拉伸', detail: '右侧 (大腿前侧)' },
        { name: '胭绳肌拉伸', detail: '左侧 (大腿后侧)' },
        { name: '胭绳肌拉伸', detail: '右侧 (大腿后侧)' },
        { name: 'ITB 髂胫束', detail: '左侧 (双脚交叉)' },
        { name: 'ITB 髂胫束', detail: '右侧 (双脚交叉)' },
        { name: '腓肠肌拉伸', detail: '左侧 (小腿后侧直腿)' },
        { name: '腓肠肌拉伸', detail: '右侧 (小腿后侧直腿)' },
        { name: '比目鱼肌拉伸', detail: '左侧 (小腿后侧屈膝)' },
        { name: '比目鱼肌拉伸', detail: '右侧 (小腿后侧屈膝)' }
      ]
    },
    {
      key: 'strength',
      label: '力量强化',
      icon: '💪',
      work: 50,
      rest: 15,
      items: [
        // 靠墙静蹲做 6 组，每组 50 秒，组间休息 15 秒
        { name: '靠墙静蹲', detail: '', sets: 6 }
      ]
    }
  ]
};
