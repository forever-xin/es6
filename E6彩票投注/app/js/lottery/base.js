import $ from 'jquery';
class Base {
    /*
     *��ʼ�������淨˵��
     * */
    initPlayList() {
        this.play_list.set('r2', {
            bonus: 6,
            tip: '��0-11����ѡ2���������룬��ѡ�����뿪��������������������ͬ�����н�<em class="red">6</em>Ԫ',
            name: '�ζ�'
        })
            .set('r3', {
                bonus: 19,
                tip: '��0-11����ѡ3���������룬��ѡ�����뿪��������������������ͬ�����н�<em class="red">19</em>Ԫ',
                name: '����'
            })
            .set('r4', {
                bonus: 78,
                tip: '��0-11����ѡ4���������룬��ѡ�����뿪�����������ĸ�������ͬ�����н�<em class="red">78</em>Ԫ',
                name: '����'
            })
            .set('r5', {
                bonus: 540,
                tip: '��0-11����ѡ5���������룬��ѡ�����뿪�������������������ͬ�����н�<em class="red">540</em>Ԫ',
                name: '����'
            })
            .set('r6', {
                bonus: 98,
                tip: '��0-11����ѡ6���������룬��ѡ�����뿪��������������������ͬ�����н�<em class="red">98</em>Ԫ',
                name: '����'
            })
            .set('r7', {
                bonus: 26,
                tip: '��0-11����ѡ7���������룬��ѡ�����뿪�����������߸�������ͬ�����н�<em class="red">26</em>Ԫ',
                name: '����'
            })
            .set('r8', {
                bonus: 9,
                tip: '��0-11����ѡ8���������룬��ѡ�����뿪����������˸�������ͬ�����н�<em class="red">9</em>Ԫ',
                name: '�ΰ�'
            })
    }

    /*
     *��ʼ������ padStart�����ַ�������λ�ĳ��ȡ����������в�0
     * */
    initNumber() {
        for (let i = 1; i < 12; i++) {
            this.number.add(('' + i).padStart(2, '0'))
        }
    }
    /*
     *������©���ݣ�map������entries�õ�ֵ
     * */
    setOmit(omit) {
        let self = this;
        self.omit.clear();
        for (let [index,item] of omit.entries()) {
            self.omit.set(index, item)
        }
        $(self.omit_el).each(function (index, item) {
            $(item).text(self.omit.get(index))
        });
    }
    /*
    *���ÿ���
    *
    * */
    setOpenCode(code){
        let self = this;
        self.open_code.clear();
        for(let item of code.values()){
            self.open_code.add(item);
        }
        self.updateOpenCode&&self.updateOpenCode.call(self,code);
    }
    /*
    *����ѡ��ȡ��
    * */
    toggleCodeActive(e){
        let self = this;
        let $cur = $(e.currentTarget);//��ȡ��ѡ�е�dom
        $cur.toggleClass('btn-boll-active');
        self.getCount();
    }
    /*
    * �ı��淨
    * */
    changePlayNav(e){
        let self = this;
        let $cur=$(e.currentTarget);
        $cur.addClass('active').siblings().removeClass('active');
        self.cur_play=$cur.attr('desc').toLocaleLowerCase();
        $('#zx_sm span').html(self.play_list.get(self.cur_play).tip);
        $('.boll-list .btn-boll').removeClass('btn-boll-active');
        self.getCount();
    }
    /*
    * ������
    * */
    assistHandle(e){
        e.preventDefault();
        let self = this;
        let $cur = $(e.currentTarget);
        let index = $cur.index();
        $('.boll-list .btn-boll').removeClass('btn-boll-active');
        if(index===0){
            $('.boll-list .btn-boll').removeClass('btn-boll-active');
        }
        if(index===1){
            $('.boll-list .btn-boll').each(function(i,t){
                if(t.textContent-5>0){
                    $(t).addClass('btn-boll-active')
                }
            })
        }
        if(index===2){
            $('.boll-list .btn-boll').each(function(i,t){
                if(t.textContent-6<0){
                    $(t).addClass('btn-boll-active')
                }
            })

        }
        if(index===3){
            $('.boll-list .btn-boll').each(function(i,t){
                if(t.textContent%2==1){
                    $(t).addClass('btn-boll-active')
                }
            })

        }
        if(index===4){
            $('.boll-list .btn-boll').each(function(i,t){
                if(t.textContent%2==0){
                    $(t).addClass('btn-boll-active')
                }
            })

        }
        self.getCount();
    }
    getName(){
        return this.name;
    }
    /*
    * ��Ӻ���
    * */
    addCode(){
        let self = this;
        let $active = $('.boll-list .btn-boll-active').text().match(/\d{2}/g);
        let active = $active?$active.length:0;
        let count = self.computeCount(active,self.cur_play);
        if(count){
            self.addCodeItem($active.join(' '),self.cur_play,self.play_list.get(self.cur_play).name,count)
        }
    }
    /*
    * ��ӵ��κ��� �����ַ���ģ��
    * */
    addCodeItem(code,type,typeName,count){
        let self = this;
        const tpl=`
        <li codes="${type}|${code}" bonus="${count*2}" count="${count}">
       <div class="code">
       <b>${typeName}${count}>1? '��ʽ':'��ʽ'}</b>
       <b class="em">${code}</b>
       [${count}ע,<em class="code-list-money">${count*2}</em>Ԫ]
       </div>
        </li>
        `;
       $(self.cart_el).append(tpl);
        self.getTotal();
    }
    getCount(){
        let self=this;
        let active=$('.boll-list .btn-boll-active').length;
        let count=self.computeCount(active,self.cur_play);
        let range = self.computeBonus(active,self.cur_play);
        let money = count*2;
        let win1=range[0]-money;
        let win2=range[0]-money;
        let tpl;
        let c1=(win1<0&&win2<0)?Math.abs(win1):win1;
        let c2=(win1<0&&win2<0)?Math.abs(win2):win2;
        if(count===0){
            tpl=`��ѡ��<b class="red">${count}</b>ע����<b class="red">${count*2}</b>Ԫ`;
        }else if(range[0]===range[1]){
            tpl=`��ѡ��<b>${count}</b>ע����<b>${count*2}</b>Ԫ<em>���н�������
            <strong class="red">${range[0]}</strong>Ԫ��
            ����${win1>=0?'ӯ��':'����'}
            <strong class="${win1>=0?'red':'green'}">${Math.abs(win1)}</strong>Ԫ��
            </em>`;
        }else{
            tpl=`��ѡ��<b>${count}</b>ע����<b>${count*2}</b>Ԫ<em>���н�������
            <strong class="red">${range[0]}</strong>�� <strong class="red">${range[1]}</strong>Ԫ
            ����${(win1<0&&win2<0)?'����':'ӯ��'}
            <strong class="${win1>=0?'red':'green'}">${c1}</strong>��
            <strong class="${win2>=0?'red':'green'}">${c2}</strong>Ԫ��
            </em> `;
        }
        $('.self_info').html(tpl);
    }
    /*
    *�������н��
    * */
    getTotal(){
        let count = 0;
        $('.codelist li').each(function(index,item){
            count += $(item).attr('count')*1;
        });
        $('#count').text(count);
        $('#money').text(count*2);
    }
    /*
    *���������
    * */
    getRandom(num){
        let arr=[],index;
        let number = Array.from(this.number);
        while(num--){
            index = Number.parseInt(Math.random()*number.length);
            arr.push(number[index]);
            number.splice(index,1);
        }
        return arr.join(' ');
    }
    /*
     *����������
     */
    getRandomCode(e){
        e.preventDefault();
        let num=e.currentTarget.getAttribute('count');
        let play = this.cur_play.match(/\d+/g)[0];
        let self = this;
        if(num==='0'){
            $(self.cart_el).html('')
        }else{
            for(let i=0;i<num;i++){
                self.addCodeItem(self.getRandom(play),self.cur_play,self.play_list.get(self.cur_play).name,1);
            }
        }
    }
}
export default Base;