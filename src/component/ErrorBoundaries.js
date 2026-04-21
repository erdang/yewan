import React, { Component } from 'react';
import { ErrorBlock, Button } from 'antd-mobile';
// import { captureException } from '@/utility/errorInit';

class MyErrorBoundary extends Component {
    state = {
        error: null,
        info: null,
    };

    static getDerivedStateFromError(error) {
        // 更新 state，下次渲染可以展示错误相关的 UI
        console.log(error);
        return { error: error };
    }

    componentDidCatch(error, info) {
        // captureException(error);
        //告诉error事件 ErrorBoundary已处理异常
        localStorage.setItem('ErrorBoundary', true);
        this.setState({
            info: info.componentStack,
        });
    }

    render() {
        if (this.state.error) {
            // 渲染出错时的 UI
            return (
                <div className="error-div" style={{ textAlign: 'center' }}>
                    <ErrorBlock></ErrorBlock>
                    <div className="stack-div">{this.state.info}</div>
                    <div className="error-btn">
                        <Button
                            color="default"
                            onClick={() => {
                                window.location.reload();
                            }}
                        >
                            刷新页面
                        </Button>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}

export default MyErrorBoundary;
