import './NewsPanel.css';
import React from 'react';
import NewsCard from '../NewsCard/NewsCard';
import Auth from '../Auth/Auth';
import _ from 'lodash';

// NewsPanel should maintain a state that is a dynamic list of NewsCard.
// NewsPanel cannot be a function, it should be a class to maintain a state
class NewsPanel extends React.Component {

    constructor() {
        super(); // 用this前必须用super
        // list of NewsCards;
        this.state = { news:null, pageNum:1, loadedAll:false };
    }

    componentDidMount() { // react component life cycle 函数，需要明确知道执行顺序
        this.loadMoreNews();
        this.loadMoreNews = _.debounce(this.loadMoreNews, 1000); // 去抖动的wrapper
        // 绑定事件到鼠标滚轮
        window.addEventListener('scroll', () => this.handleScroll());

    }
    
    handleScroll() {
        let scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop;
        if ((window.innerHeight + scrollY) >= (document.body.offsetHeight -50)) {
            console.log('Loading more news.');
            this.loadMoreNews();
        }
        this.loadMoreNews();
    }

    loadMoreNews() {
        console.log('Actually triggered loading more news');
        if (this.state.loadedAll == true){
            return;
        }

        const news_url = 'http://' + window.location.hostname +':3000/news/userId=' + Auth.getEmail() + "&pageNum=" + this.state.pageNum;
        const request = new Request(news_url, {
            method: 'GET',
            headers: {
                'Authorization':'bearer ' + Auth.getToken(),
            }
        });

        // res.json() 返回的也是一个promise！
        fetch(request)
            .then(res => {
                console.log("Response: " + res);
                console.log(res === null);
                return res.json();}
            )
            .then(news => {
                if (!news || news.length == 0) {
                  this.setState({loadedAll:true})
                }
                this.setState({
                  news: this.state.news? this.state.news.concat(news) : news,
                  pageNum: this.state.pageNum + 1,
                });
            });

        // this.setState({
        //     news: [
        //         {
        //         "source": "The Wall Street Journal",
        //         "title": "Berkshire Hathaway Benefits From US Tax Plan",
        //         "description": "Berkshire Hathaway posted a $29 billion gain in 2017 related to changes in U.S. tax law, a one-time boost that inflated annual profits for the Omaha conglomerate.",
        //         "url": "https://www.wsj.com/articles/berkshire-hathaway-posted-29-billion-gain-in-2017-from-u-s-tax-plan-1519480047",
        //         "urlToImage": "https://si.wsj.net/public/resources/images/BN-XP717_3812B_TOP_20180224064100.jpg",
        //         "publishedAt": "2018-02-24T18:42:00Z",
        //         "digest":"3RjuEomJo26O1syZbU7OHA==\n",
        //         "reason": "Recommend"},
        //         {      
        //         "source": "fortune",
        //         "title": "Here's How Much Bitcoin Elon Musk Owns",
        //         "description": "Tesla CEO Elon Musk isn’t exactly active in cryptocurrency. Musk revealed this week on Twitter how much Bitcoin he owns—and it’s not much.",
        //         "url": "http://fortune.com/2018/02/23/bitcoin-elon-musk-value/",
        //         "urlToImage": "https://fortunedotcom.files.wordpress.com/2018/01/elon-musk-tesla-silicon-valley-sex-party.jpg",
        //         "publishedAt": "2018-02-23T23:26:30Z",
        //         "digest":"3RjuEomJo26OadyZbU7OHA==\n",
        //         "reason": "Recommend"   
        //         }
        //     ]
        // });
    }

    // 先试用mock数据
        //    /* 单向数据流，news从parent到儿子 */
    // 这里有一个iterating over arrs的问题。 每个child in array shou;d have a unique key prop. 
    // https://stackoverflow.com/questions/28329382/understanding-unique-keys-for-array-children-in-react-js
    renderNews() {
        const news_list = this.state.news.map(news => {
            return(
              <a className='list-group-item' key={news.digest} href='#'>
                <NewsCard news={news} />
              </a>
            );
          });

        return(
            <div className='container-fluid'>
                <div className='list-group'>
                    {news_list}
                </div>
            </div>
        );
    }

    render() {
        if (this.state.news) {
            return(
                <div>
                    {this.renderNews()}
                </div>
            );
        } else {
            return (
                <div id = 'msg-app-loading'>
                loading...
                </div>
            );
        }
    }


}

export default NewsPanel;
