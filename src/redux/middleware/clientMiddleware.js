import { message } from 'antd';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

export default function clientMiddleware(client) {
  return ({ dispatch, getState }) => {
    return next => action => {
      if (typeof action === 'function') return action(dispatch, getState);

      const { promise, types, ...rest } = action;
      if (!promise) return next(action);

      const actionPromise = promise(client);
      next(showLoading());

      switch (types.length) {
        case 1: {
          const [SUCCESS] = types;
          actionPromise.then(
            result => {
              next(hideLoading());
              return next({ ...rest, result, type: SUCCESS });
            },
            error => {
              next(hideLoading());
              message.destroy();
              message.error(error.msg);
              return error;
            }
          );
          return actionPromise;
        }

        case 2: {
          const [SUCCESS, FAILURE] = types;
          actionPromise.then(
            result => {
              next(hideLoading());
              return next({ ...rest, result, type: SUCCESS });
            },
            error => {
              next(hideLoading());
              next(hideLoading());
              message.destroy();
              return next({ ...rest, error, type: FAILURE });
            }
          );
          return actionPromise;
        }

        case 3: {
          const [REQUEST, SUCCESS, FAILURE] = types;
          next({ ...rest, type: REQUEST });
          actionPromise.then(
            result => {
              next(hideLoading());
              return next({ ...rest, result, type: SUCCESS });
            },
            error => {
              next(hideLoading());
              next(hideLoading());
              message.destroy();
              return next({ ...rest, error, type: FAILURE });
            }
          );
          return actionPromise;
        }

        default: {
          console.error('参数types异常');
          return Promise.reject({ msg: '参数types异常' });
        }
      }
    };
  };
}
