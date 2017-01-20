
import moment from 'moment';

const initState = {
  monthAry:[],
  sDate:'',
  eDate:''
};

export default function updateBar(state = initState, action) {
    switch (action.type) {
        case 'UPD_DATE': {
            console.log(`reducer: ${action.type} ${action.data}`);
            if (action.option == 'start') {
                return Object.assign({}, state, {
                    sDate: action.data
                });
            } else {
                return Object.assign({}, state, {
                    eDate: action.data
                });
            }
        }
        case 'UPD_BAR': {
            const { sDate, eDate } = state;

            if (!sDate || !eDate || eDate < sDate) {
                return state;
            }

            let diff = moment(eDate, 'YYYY-MM-DD').diff(moment(sDate, 'YYYY-MM-DD'), 'months');
            console.log(diff);
            if (diff < 0) {
                console.error('invalid month range(<0)');
                return;
            }
            let ary = [];
            for (let i = 0; i <= diff; i++) {
                let date = moment(sDate, 'YYYY-MM-DD').add(i, 'M');
                let daysInMonth = date.daysInMonth();
                ary.push({
                    mstr: date.format('MMM'),
                    y: parseInt(date.format('YYYY')),
                    m: parseInt(date.format('MM')),
                    daysInMonth
                });
            }

            console.log(`reducer: ${action.type} ${ary}`);

            return Object.assign({}, state, {
                monthAry: ary
            });
        }
        case 'SYNC': {
            const { sDate, eDate, monthAry } = state;

            return Object.assign({}, state, {
                sDate: action.sDate,
                eDate: action.eDate,
                monthAry: action.monthAry
            });
        }
        default:
            return state;
    }
}
