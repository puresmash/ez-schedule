

const initState = {
  actBalls: new Map(),
  preBalls: new Map()
};

export default function updateBall(state=initState, action){
  switch (action.type) {
    case 'UPD_ACT_BALL': {
        let { actBalls } = state;
        actBalls = new Map(actBalls);

        let ball = actBalls.get(action.id);
        ball.date = action.date;

        return Object.assign({}, state, {actBalls});
    }
    case 'UPD_PRE_BALL': {
        let { preBalls } = state;
        preBalls = new Map(preBalls);

        let ball = preBalls.get(action.id);
        ball.date = action.date;

        return Object.assign({}, state, {preBalls});
    }
    case 'UPD_DESC': {
        let { preBalls } = state;
        preBalls = new Map(preBalls);

        let ball = preBalls.get(action.id);
        ball.desc = action.desc;

        return Object.assign({}, state, {preBalls});
    }
    case 'UPD_ACT_BALL_COLOR': {
        console.log(`reducer: ${action.type} ${action.id} ${action.color}`);
        console.log(action.color);
        let { actBalls } = state;
        actBalls = new Map(actBalls);

        let ball = actBalls.get(action.id);
        ball.color = action.color;

        return Object.assign({}, state, {actBalls});
    }
    case 'UPD_PRE_BALL_COLOR':{
        let { preBalls } = state;
        preBalls = new Map(preBalls);

        let ball = preBalls.get(action.id);
        ball.color = action.color;

        return Object.assign({}, state, {preBalls});
    }
    case 'ADD_BALL': {
        console.log(`reducer: ${action.type} ${action.id}`);

        let { actBalls, preBalls } = state;
        actBalls = new Map(actBalls);
        preBalls = new Map(preBalls);

        actBalls.set(`act-${action.id}`, {
            id: `act-${action.id}`,
            sort: action.id,
            color: action.color
        });

        preBalls.set(`pre-${action.id}`, {
            id: `pre-${action.id}`,
            sort: action.id,
            color: action.color
        });

        return Object.assign({}, state, {
            actBalls,
            preBalls
        });
    }
    case 'SYNC': {
        let { actBalls, preBalls } = state;
        return Object.assign({}, state, {
            actBalls: action.actBalls,
            preBalls: action.preBalls
        });
    }

    default:
      return state;
  }
}
