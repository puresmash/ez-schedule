let nextBallId = 0;
//let nextPreBallId = 0;

export const UpdActBallColor = (id, color) => {
    return {
        type: 'UPD_ACT_BALL_COLOR',
        id,
        color
    }
}

export const UpdPreBallColor = (id, color) => {
    return {
        type: 'UPD_PRE_BALL_COLOR',
        id,
        color
    }
}

export const UpdActBall = (id, date) => {
    return {
        type: 'UPD_ACT_BALL',
        id,
        date
    }
}

export const UpdPreBall = (id, date) => {
    return {
        type: 'UPD_PRE_BALL',
        id,
        date
    }
}

export const AddBall = () => {
    return {
        type: 'ADD_BALL',
        id: nextBallId++,
        color: 'blue'
    }
}

export const UpdDesc = (id, desc) => {
    return {
        type: 'UPD_DESC',
        id,
        desc
    }
}

export const UpdDate = (data, option) => {
    return {
        type: 'UPD_DATE',
        option,
        data
    }
}

export const CreateCanvas = () => {
    return {
        type: 'UPD_BAR'
    }
}
