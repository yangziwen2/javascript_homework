var scenarioArr = [
{
	debutTime: 1000, 							//必须按出场时间设置scenarioArr中元素的顺序
	template: 'basic1',
	endure: 20,									//可承受的子弹数
	motionChain: [
		{
			type: 'plane',
			beginPos: {
				left: 100,
				top: -50
			},
			targetPos: {
				left: 100,
				top: 110
			},
			timeSpend: 1500,
			delay: 11000,
			easing: '>',
			bullet: {
				type: 'radiation',				//弹幕类型
				template: 'basic1',				//子弹模板
				detail: {
					startAngle: 0,				//可以不用
					waveTimes: 20,				//弹幕的轮数
					numPerWave: 6,				//每轮弹幕的子弹个数
					waveInterval: 500,			//相邻两轮弹幕的间隔时间
					timeSpend: 25000,			//子弹到达targetPos所花的时间
					easing: '>',				//easingFormula的类型
					beginPolar: {				//子弹的初始位置
						center: 'scatter',
						r: 10,
						theta: 0
					},
					targetPolar: {				//子弹的终止位置
						r: 600,
						theta: 360
					},
					availableAngle: 360,		//弹幕角度范围
					offsetFactor: 3,			//不同波次的弹幕的离散指数
					offset: 10					//离散偏移度
				}
			}
		},
		{
			type: 'polar',
			beginPos:{
				center:{
					x: 400,
					y: 125
				},
				r: 288,
				theta: 180
			},
			targetPos:{
				center: {
					x: 400,
					y: 125
				},
				r: 1000,
				theta: 0
			},
			timeSpend: 11000,
			easing: 'linear'
		}
	]
},
{
	debutTime: 2000, 
	template: 'basic1',
	endure: 20,
	motionChain: [
		{
			type: 'plane',
			beginPos: {
				left: 276,
				top: -50
			},
			targetPos: {
				left: 276,
				top: 110
			},
			timeSpend: 1500,
			delay: 11000,
			easing: '>',
			bullet: {
				type: 'radiation',
				template: 'basic2',
				detail: {
					startAngle: 0,
					waveTimes: 20,
					numPerWave: 6,
					waveInterval: 500,
					timeSpend: 15000,
					easing: '>',
					beginPolar: {
						center: 'scatter',
						r: 10,
						theta: 60
					},
					targetPolar: {
						r: 600,
						theta: 0
					},
					availableAngle: 120,
					offsetFactor: 0,
					offset: 0
				}
			}
		},
		{
			type: 'polar',
			beginPos:{
				center:{
					x: 0,
					y: 125
				},
				r: 288,
				theta: 0
			},
			targetPos:{
				center: {
					x: 0,
					y: 125
				},
				r: 1000,
				theta: 180
			},
			timeSpend: 10000,
			easing: 'linear'
		}
	]
}
];