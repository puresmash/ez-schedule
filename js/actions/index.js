let nextBallId = 0;
//let nextPreBallId = 0;

export const UpdActBall = (id, date) =>{
  return {
    type: 'UPD_ACT_BALL',
    id,
    date
  }
}

export const UpdPreBall = (id, date) =>{
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
    color: 'red'
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
