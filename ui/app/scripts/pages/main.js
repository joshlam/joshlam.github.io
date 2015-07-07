import ZComponent from 'z-component';
import Page from 'components/page';
import Navigation from 'components/nav';

class MainPage extends Page {
  constructor({ context }) {
    super(...arguments);

    this.context = context;

    // this.title = ;
    // this.description = ;

    const nav = this.nav = new Navigation({
      items: [
        {
          id: 'health',
          heading: ,
          section:
        },
        {
          id: 'travel',
          heading: ,
          section:
        },
        {
          id: 'food',
          heading: ,
          section:
        },
        {
          id: 'activities',
          heading: ,
          section:
        },
        {
          id: 'expenses',
          heading: ,
          section:
        }
      ]
    });
  }

  remove() {
    this.nav.remove();
    super.remove();
  }

  static get classList() {
    return Page.classList.concat(['main-page']);
  }
}

export default MainPage;
