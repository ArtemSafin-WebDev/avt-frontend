/*tslint:disable*/
import { IVisaApplicationFormState } from '../../../components/Landing/Forms/VisaApplicationForm';

const config = require('../../../../../config/main');
import { getHeaders, handleErrors } from '../../../helpers/HttpHelpers';

export const getPageList = () => {
  return () => {
    return fetch(
      `${config.apiEndpoint}/pages/landing_list/`, {
        method: 'get',
        headers: getHeaders(),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            return res;
          });
      }
    }).catch((e) => console.warn(e));
  };
};

export const defaultPage = {
  title: 'Главная',
  url: 'home',
  nodes: [
    {
      type: 'main_header_iframe',
      title: '',
      size: '',
      description: '', children: [], action_url: '', action_text: '', action_icon_url: '', image_url: '',
    },
    {
      type: 'card_holder',
      title: 'Услуги',
      size: '',
      description: 'Все необходимое для комфортных командировок и ярких путешествий.',
      children: [
        {
          type: 'imaged_card',
          title: 'Отели',
          description: 'Забронируем отель в любой точке мира',
          size: 'w-col-4',
          image_url: '/public/images/img-1.jpg',
          action_url: '/page/hotels',
          action_text: 'Подробнее',
          action_icon_url: '', children: []
        },
        {
          type: 'imaged_card',
          title: 'MICE',
          description: 'Организуем корпоративное мероприятие в России и зарубежом',
          size: 'w-col-4',
          image_url: '/public/images/img-2.jpg',
          action_url: '/page/mice',
          action_text: 'Подробнее',
          action_icon_url: '', children: []
        },
        {
          type: 'imaged_card',
          title: 'VIP и бизнес-залы',
          description: 'Услуги Fast Track и Meet &amp; Assist',
          size: 'w-col-4',
          image_url: '/public/images/img-3.jpg',
          action_url: '/page/vip',
          action_text: 'Подробнее',
          action_icon_url: '', children: []
        },
        {
          type: 'imaged_card',
          title: 'Визовая поддержка',
          description: 'Поможем оформить визу в любую страну',
          size: 'w-col-4',
          image_url: '/public/images/img-4.jpg',
          action_url: '/page/visa',
          action_text: 'Подробнее',
          action_icon_url: '', children: []
        },
        {
          type: 'imaged_card',
          title: 'Трансфер',
          description: 'Закажем любое транспортное средство от автомобиля до самолета',
          size: 'w-col-4',
          image_url: '/public/images/img-5.jpg',
          action_url: '/page/transfer',
          action_text: 'Подробнее',
          action_icon_url: '', children: []
        },
        {
          type: 'imaged_card',
          title: 'Деловая авиация',
          description: 'Организуем чартерные рейсы для бизнеса и отдыха',
          size: 'w-col-4',
          image_url: '/public/images/img-6.jpg',
          action_url: '/page/aviation',
          action_text: 'Подробнее',
          action_icon_url: '', children: []
        },
        {
          type: 'imaged_card',
          title: 'Страхование',
          description: 'Оформим страховку для путешествия',
          size: 'w-col-4',
          image_url: '/public/images/img-7.jpg',
          action_url: '/page/insurance',
          action_text: 'Подробнее',
          action_icon_url: '', children: []
        },
        {
          type: 'imaged_card',
          title: 'Самостоятельная бронь',
          description: 'Подключим к OnePort — системе самостоятельного бронирования',
          size: 'w-col-4',
          image_url: '/public/images/img-8.jpg',
          action_url: '/page/oneport',
          action_text: 'Подробнее',
          action_icon_url: '', children: []
        },
      ], action_url: '', action_text: '', action_icon_url: '', image_url: '',
    },
    {
      type: 'card_holder',
      title: 'Компания',
      description: 'AVT является одним из лидеров в Татарстане на рынке продаж транспортных и туристических услуг.',
      children: [
        {
          type: 'card',
          title: 'Аккредитация IATA',
          description: 'Одними из первых в Татарстане прошли аккредитацию Международной ассоциации воздушного транспорта',
          size: 'w-col-6',
          image_url: '',
          action_url: '#intercom',
          action_text: 'Подробнее',
          action_icon_url: '', children: []
        },
        {
          type: 'card',
          title: 'Агент Транспортной Клиринговой Палаты',
          description: 'Работаем по Системе взаиморасчетов на воздушном транспорте',
          size: 'w-col-6',
          image_url: '',
          action_url: '#intercom',
          action_text: 'Подробнее',
          action_icon_url: '', children: []
        },
        {
          type: 'card',
          title: 'Готовые решения',
          description: 'Предлагаем готовые решения для путешествий внутри страны',
          size: 'w-col-6',
          image_url: '',
          action_url: '',
          action_text: '',
          action_icon_url: '', children: []
        },
        {
          type: 'card',
          title: 'Авиаброкер с десятилетним стажем',
          description: 'Один из лидеров по бронированию Private Jet в Республике Татарстан',
          size: 'w-col-6',
          image_url: '',
          action_url: '',
          action_text: '',
          action_icon_url: '', children: []
        },
      ], action_url: '', action_text: '', action_icon_url: '', image_url: '',
    },
  ],
};

export const eventHolder = {
  type: 'card_holder',
  title: 'Принимали участие в организации',
  description: '',
  children: [
    {
      type: 'card',
      title: 'Конференция ЦИПР-2018',
      description: 'Крупнейшая ИТ-конференция по вопросам цифровой экономики в Иннополисе.\n• Размещение участников и организаторов\n• Размещение ВИП-гостей российских ведомств и госкорпораций.',
      size: 'w-col-4',
      image_url: '',
      action_url: 'http://cipr.ru/',
      action_text: 'Подробнее',
      action_icon_url: '', children: []
    },
    {
      type: 'card',
      title: 'Форум БИОТЕХМЕД-2018',
      description: 'Ежегодный форум по биотехнологиям в Геленджике.\n• Организация перелёта сотрудников компаний\n• Обеспечение полного транспортного обслуживания\n• Размещение участников в отелях города',
      size: 'w-col-4',
      image_url: '',
      action_url: 'https://www.biotechmedconf.ru/',
      action_text: 'Подробнее',
      action_icon_url: '', children: []
    },
    {
      type: 'card',
      title: 'Молодежная архитектурная биеннале 2017',
      description: 'Первая в России Молодежная архитектурная биеннале в Иннополисе.\n• Размещение участников, гостей и жюри биеннале',
      size: 'w-col-4',
      image_url: '',
      action_url: 'https://www.architectbiennale.ru/',
      action_text: 'Подробнее',
      action_icon_url: '', children: []
    },
  ], action_url: '', action_text: '', action_icon_url: '', image_url: '',
};

export const getPage = (name) => {
  return () => {
    if (!name) {
      return defaultPage;
    }
    return fetch(
      `${config.apiEndpoint}/pages/${name}/`, {
        method: 'get',
        headers: getHeaders(),
      }).then((res) => {
      if (res.ok) {
        return res.json()
          .then((res) => {
            if (name === 'mice') {
              if (res.nodes) {
                const temp1 = res.nodes[res.nodes.length - 1];
                const temp2 = res.nodes[res.nodes.length - 2];
                res.nodes[res.nodes.length - 2] = eventHolder;
                res.nodes[res.nodes.length - 1] = temp2;
                res.nodes.push(temp1);
              }
            }
            return res;
          });
      } else {
        return defaultPage;
      }
    }).catch((e) => {
      console.warn(e);
      return defaultPage;
    });
  };
};

export const visaRequest = (formData: IVisaApplicationFormState) => {
  return (dispatch) => {
    formData.phone_number = formData.phone_number.replace('+7', '');
    const names = formData.first_last_name.split(' ');
    formData.first_name = names[0];
    formData.second_name = '';
    formData.last_name = names[1];
    formData.departure_date = formData.departure_date ? formData.departure_date.toDate() : null;
    formData.arrival_date = formData.arrival_date ? formData.arrival_date.toDate() : null;

    return fetch(
      `${config.apiEndpoint}/request/visa/`, {
        method: 'post',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      }).then((res) => {
        if (res.ok) {
          return res.json()
            .then((res) => {
              handleErrors('Заявка успешно отправлена!', dispatch);
              return res;
            });
        }
    }).catch((e) => console.warn(e));
  };
};

export const leadRequest = (formData) => {
  return () => {
    if (formData.phone_number) {
      formData.phone_number = formData.phone_number.replace('+7', '');
    }
    if (formData.first_last_name) {
      const names = formData.first_last_name.split(' ');
      formData.first_name = names[0];
      if (names.length > 1) {
        formData.second_name = names[1];
        if (names.length > 1) {
          formData.last_name = names[2];
        }
      }
    }

    formData.last_name = formData.last_name ? formData.last_name : 'Без отчества';

    // Hotels page
    if (formData.departure_point) {
      const obj : {departure_point?: any; departure_date?: string; arrival_date?: string; } = {};
      obj.departure_point = formData.departure_point.title + ', ' + formData.departure_point.country_code;
      obj.departure_date = formData.departure_date && formData.departure_date.format('DD.MM.YYYY');
      obj.arrival_date = formData.arrival_date && formData.arrival_date.format('DD.MM.YYYY');
      formData = obj;
    }

    formData.url = window.location.pathname.split('#')[0];
    const activeLeads = $('.open-lead-modal.active');
    if (!formData.title) {
      const h1 = document.querySelector('.h1');
      formData.title = formData.url.replace('/page/', '') + ' '
        + (activeLeads.length > 0
          ? activeLeads.find('h3').text()
          : h1 && h1.innerHTML);
    }
    formData.data = {};
    return fetch(
      `${config.apiEndpoint}/request/lead/`, {
        method: 'post',
        headers: getHeaders(),
        body: JSON.stringify(formData),
      }).then((res) => {
        if (res.ok) {
          return res.json()
            .then(() => {
              return true;
            });
        } else {
          return false;
        }
    }).catch((e) => console.warn(e));
  };
};
