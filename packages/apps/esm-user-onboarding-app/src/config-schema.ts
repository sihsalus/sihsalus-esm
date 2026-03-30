import { type Placement } from 'react-joyride';
import { Type } from '@openmrs/esm-framework';

export const configSchema = {
  showTutorial: {
    _type: Type.Boolean,
    _default: false,
    _description: 'Enable or Disable Onboarding Walkthrough',
  },
  tutorialData: {
    _type: Type.Array,
    _description: 'List of tutorials to be displayed in the modal',
    _default: [
      {
        title: 'Basic Overview',
        description:
          'This guide provides a quick look at the essential components that shape the layout and user experience of our homepage.',
        steps: [
          {
            target: '[aria-label="OpenMRS"]',
            content:
              'Welcome to OpenMRS! This is the main dashboard where you can navigate to various features of the system.',
          },
          {
            target: '[data-tutorial-target="search-patient-icon"]',
            content: 'This is the search icon. Use it to find patients in the system quickly.',
          },
          {
            target: '[data-tutorial-target="add-patient"]',
            content: 'This is the add patient icon. Click here to register a new patient into the system.',
          },
          {
            target: '[data-tutorial-target="user-settings"]',
            content: 'The user icon. Click here to change your user preferences and settings.',
          },
        ],
      },
      {
        title: 'Registering a Patient',
        description: 'Learn how to register a new patient into the system.',
        steps: [
          {
            target: '[data-tutorial-target="add-patient"]',
            content: 'Click here to add a patient to the system.',
            spotlightClicks: true,
            hideCloseButton: true,
            hideNextButton: true,
            hideFooter: true,
            data: {
              autoNextOn: '#demographics',
            },
          },
          {
            target: '#demographics',
            title: 'Demographics',
            content:
              'This is the Demographics section. Here you can find various fields and information related to the patient.',
            hideBackButton: true,
          },
          {
            target: '#contact',
            title: 'Contact Details',
            content: "Here you can update the patient's contact information.",
          },
          {
            target: '#relationships',
            title: 'Relationships',
            content: "In this section, you can manage the patient's relationships.",
          },
          {
            target: 'button[type="submit"]',
            content: "Click this button to register the patient's information into the system.",
          },
        ],
      },
      {
        title: 'Patient Chart',
        description:
          'Patient chart is the main point of interaction between healthcare professionals and patient data, where you can manage everything related to a single patient.',
        steps: [
          {
            target: '[data-tutorial-target="search-patient-icon"]',
            content:
              'To access the patient chart, first, you need to select a patient. To start, click here to open the search box so that we can search for a patient.',
            spotlightClicks: true,
            hideNextButton: true,
            data: {
              autoNextOn: '[data-tutorial-target="patient-search-bar"]',
            },
          },
          {
            target: '[data-tutorial-target="patient-search-bar"]',
            content:
              'Now, enter the name or the ID of the patient here. Some example patient names that you can search for are: John, Smith, Mary.',
            hideNextButton: false,
            hideBackButton: true,
            spotlightClicks: true,
          },
          {
            target: '[data-tutorial-target="floating-search-results-container"]',
            content: 'Click on the patient you want to go to their patient chart.',
            spotlightClicks: true,
            disableOverlay: false,
            placement: 'left',
            hideNextButton: true,
            hideBackButton: true,
            data: {
              autoNextOn: '[data-extension-slot-name="action-menu-patient-chart-items-slot"]',
            },
          },
          {
            target: 'body',
            title: 'Patient Chart',
            content:
              "Welcome to the Patient Chart View! Here, you can quickly see everything about your patient's health history, visits, medications, allergies, and test results—all in one place. It's designed to help you provide the best care efficiently.",
            spotlightClicks: true,
            hideBackButton: true,
            placement: 'center',
          },
          {
            target: '[data-extension-id="patient-banner"]',
            title: 'Patient header',
            content:
              'The patient header contains all the key information you need to identify the patient you are currently viewing. You can click on the "Show Details" button to see additional patient information.',
            spotlightClicks: true,
            hideBackButton: true,
          },
          {
            target: '[aria-label="Left navigation"]',
            title: 'Left panel',
            content:
              'The left panel shows the sections of the patient chart. Currently, we are on the patient summary page.',
            spotlightClicks: true,
            placement: 'right',
          },
          {
            target: '[data-extension-slot-name="patient-chart-summary-dashboard-slot"]',
            title: 'Patient summary widgets',
            content:
              'Patient Summary is a personalized view made up of widgets that show essential features and information for quick access.',
          },
          {
            target: '[data-extension-slot-name="action-menu-patient-chart-items-slot"]',
            title: 'Siderail',
            content:
              'The siderail contains a series of links that take users to different tabs in the Workspace, such as the order basket, visit notes, and clinical forms. Once open, the Workspace is persistent across pages (for example, all pages within the patient chart).',
          },
          {
            target: 'body',
            content:
              "Great job! You've completed the tutorial. Now, take a moment to explore the Patient Chart View and discover all its features. Feel free to navigate around and get comfortable with the layout. If you need to return to the home page, just click the close button in the top right corner. Happy exploring!",
            placement: 'center',
          },
        ],
      },
      {
        title: 'Finding a Patient',
        description:
          'Learn how to find a patient in the system using basic and advanced search features, including the use of filters to refine results.',
        steps: [
          {
            target: '[data-tutorial-target="search-patient-icon"]',
            content: 'Click on the search icon to open the search box so that we can search for a patient.',
            spotlightClicks: true,
            hideNextButton: true,
            data: {
              autoNextOn: '[data-tutorial-target="patient-search-bar"]',
            },
          },
          {
            target: '[data-tutorial-target="patient-search-bar"]',
            content:
              'Now, enter the name of the patient here. If you know the patient ID, you can use that as well. You will see the results if the patient you entered exists in the system. Some example patient names that you can search for are: John, Smith, Mary.',
            hideNextButton: false,
            hideBackButton: true,
            spotlightClicks: true,
          },
          {
            target: '[data-tutorial-target="floating-search-results-container"]',
            content:
              'The search container shows only the top results and if they are not the patient you want, or you cannot find the patient by name or the patient ID, you can use advanced search tools to narrow down your search. Click next to learn more about the advanced search options.',
            spotlightClicks: false,
            disableOverlay: false,
            hideNextButton: false,
            hideBackButton: true,
          },
          {
            target: 'button[type="submit"]',
            content:
              'The advanced search provides additional search fields like date of birth and phone number to help find the right patient, which comes in helpful in scenarios where multiple patients have the same name. Click here to access the advanced search tool.',
            spotlightClicks: true,
            placement: 'bottom',
            hideNextButton: true,
            hideBackButton: true,
            data: {
              autoNextOn: '[data-openmrs-role="Refine Search"]',
            },
          },
          {
            target: '[data-openmrs-role="Refine Search"]',
            title: 'Filters section',
            content:
              'You can refine your search by applying filters such as date of birth, age, sex, and phone number here.',
            spotlightClicks: true,
            hideBackButton: true,
          },
          {
            target: '[data-openmrs-role="Search Results"]',
            content:
              'Here you can see all the patients who match the search criteria. Clicking on a patient will open the patient’s patient chart.',
            placement: 'right',
          },
          {
            target: '[data-tutorial-target="close-search-icon"]',
            content: 'That’s the end of the tutorial. Click on the close button to go back to the home page.',
            spotlightClicks: true,
            placement: 'bottom',
            hideNextButton: true,
            hideBackButton: true,
            data: {
              autoNextOn: '[data-extension-id="page-header"]',
            },
          },
        ],
      },
      {
        title: 'Patient Lists',
        description:
          'This tutorial will guide you through creating and managing patient lists to help organize and track your patients more effectively.',
        steps: [
          {
            target: '[data-extension-id="patient-lists-dashboard-link"]',
            content:
              'Creating a patient list is a great way to keep a group of patients organized for easier management. Click here to go to the patient lists view',
            spotlightClicks: true,
            hideNextButton: true,
            data: {
              autoNextOn: '[data-openmrs-role="New List"]',
            },
          },
          {
            target: '[data-openmrs-role="New List"]',
            content: "Now, let's try creating a new list. Click here to open the new patient list form.",
            spotlightClicks: true,
            placement: 'left',
            hideNextButton: true,
            hideBackButton: true,
            data: {
              autoNextOn: '[data-tutorial-target="patient-list-form"]',
            },
          },
          {
            target: '[data-tutorial-target="patient-list-form"]',
            content: 'Enter the necessary details and click on "Create List" to create the list.',
            spotlightClicks: true,
            hideBackButton: true,
            hideNextButton: true,
            placement: 'left',
            data: {
              autoNextOn: '.omrs-snackbars-container div',
            },
          },
          {
            target: '[data-tutorial-target="all-patient-lists-tab"]',
            content: 'Click here to see all the patient lists we have in the system.',
            hideNextButton: true,
            hideBackButton: true,
            spotlightClicks: true,
            spotlightPadding: 20,
            data: {
              autoNextOn: '[data-tutorial-target="patient-lists-table"]',
            },
          },
          {
            target: '[data-tutorial-target="patient-lists-table"]',
            content:
              'Great! We have successfully created a new patient list. Find and click on the patient list you created to proceed. You can use the search option at the top right if needed.',
            disableOverlay: true,
            spotlightClicks: true,
            spotlightPadding: 40,
            hideBackButton: true,
            hideNextButton: true,
            data: {
              autoNextOn: '[data-openmrs-role="Patient Empty tile"]',
            },
          },
          {
            target: '[data-openmrs-role="Patient Empty tile"]',
            content:
              "You can see the patient list is empty since we haven't added any patients to the list yet. Click on Next to Continue",
            hideBackButton: true,
            disableOverlay: true,
          },
          {
            target: '[data-tutorial-target="search-patient-icon"]',
            content:
              'To add a patient to the list, we have to go to the respective patient’s chart view. Click here to open the search box so that we can search for a patient.',
            spotlightClicks: true,
            hideNextButton: true,
            hideBackButton: true,
            data: {
              autoNextOn: '[data-tutorial-target="patient-search-bar"]',
            },
          },
          {
            target: '[data-tutorial-target="patient-search-bar"]',
            content:
              'Now, enter the name or the ID of the patient here. Some example patient names that you can search for are: John, Smith, Mary.',
            hideNextButton: false,
            hideBackButton: true,
            spotlightClicks: true,
          },
          {
            target: '[data-tutorial-target="floating-search-results-container"]',
            content:
              'Click on the patient to go to the patient chart, where we can add the patient to our newly created list.',
            spotlightClicks: true,
            placement: 'left',
            hideNextButton: true,
            hideBackButton: true,
            data: {
              autoNextOn: '[data-extension-slot-name="action-menu-patient-chart-items-slot"]',
            },
          },
          {
            target: '[id^="patient-actions-menu-trigger-"]',
            content: 'Click on "Actions" and select "Add to List" from the drop-down menu.',
            disableOverlay: true,
            placement: 'bottom',
            spotlightClicks: true,
            hideBackButton: true,
            hideNextButton: true,
            data: {
              autoNextOn: '.cds--modal-container',
            },
          },
          {
            target: '.cds--modal-container',
            content:
              'You can see the list of patient lists here. Search for our newly created patient list using the filter, and mark the checkbox beside the patient list name. You can add the patient to multiple lists at once by selecting multiple checkboxes.',
            disableOverlay: true,
            spotlightClicks: true,
            hideBackButton: true,
            hideNextButton: true,
            placement: 'left',
            data: {
              autoNextOn: '.omrs-snackbars-container div',
            },
          },
        ],
      },
      {
        title: 'Recording Vitals',
        description:
          "Learn how to record a patient's vitals and biometric data, and review the records through the patient chart.",
        steps: [
          {
            target: '[data-tutorial-target="search-patient-icon"]',
            content:
              'To capture the vitals of a patient, you need to start by going to the patient chart view of the respective patient. Click on the search icon to open the search box so that you can search for the patient.',
            spotlightClicks: true,
            hideNextButton: true,
            data: {
              autoNextOn: '[data-tutorial-target="patient-search-bar"]',
            },
          },
          {
            target: '[data-tutorial-target="patient-search-bar"]',
            content:
              'Now, enter the name or the ID of the patient here. Some example patient names you can search for are: John, Smith, Mary.',
            hideNextButton: false,
            hideBackButton: true,
            spotlightClicks: true,
          },
          {
            target: '[data-tutorial-target="floating-search-results-container"]',
            content: 'Click on the patient to go to their patient chart.',
            placement: 'left',
            spotlightClicks: true,
            hideBackButton: true,
            hideNextButton: true,
            data: {
              autoNextOn: '[data-extension-slot-name="action-menu-patient-chart-items-slot"]',
            },
          },
          {
            target: '[data-extension-id="patient-vitals-info"] button',
            content:
              'Click on the "Record Vitals" button to open the vitals form. If the selected patient doesn\'t have an active visit, you will be prompted to start one. In that case, submit the start visit form in order to proceed to the next step.',
            disableOverlay: true,
            spotlightClicks: true,
            hideBackButton: true,
            hideNextButton: true,
            data: {
              autoNextOn: '[aria-label="Workspace header"]',
            },
          },
          {
            target: '[data-openmrs-role="Vitals and Biometrics Form"]',
            title: 'Vitals form',
            content:
              'In this form, you can enter the vitals and biometrics you have captured. If any value entered is out of the normal range, you will see ↑ (High), ↓ (Low), ↑↑ (Very High) or ↓↓ (Very Low) indicators next to the respective field. After entering all necessary details, click on the "Save and Close" button to submit the data.',
            disableOverlay: true,
            spotlightClicks: true,
            placement: 'left',
            hideBackButton: true,
            hideNextButton: true,
            data: {
              autoNextOn: '.omrs-snackbars-container div',
            },
          },
          {
            target: '[data-extension-id="patient-vitals-info"]',
            content: 'The latest vitals and biometrics data of the patient can be viewed in this section.',
            hideBackButton: true,
          },
          {
            target: '[data-extension-id="results-summary-dashboard"]',
            content:
              'Click here to go to the Vitals and Biometrics page, where you can view the past records of vitals and biometrics.',
            hideBackButton: true,
            hideNextButton: true,
            spotlightClicks: true,
            data: {
              autoNextOn: '[data-extension-slot-name="patient-chart-vitals-biometrics-dashboard-slot"]',
            },
          },
          {
            target: '[data-extension-slot-name="patient-chart-vitals-biometrics-dashboard-slot"]',
            content:
              'These tables display the history of vitals and biometrics. Indicators may be present here to show measurements that are higher or lower than the typical range.',
            hideBackButton: true,
          },
          {
            target: '[aria-label="Chart view"]',
            content: 'You can click on the "Chart" button for a graphical representation of the vitals history.',
          },
          {
            target: 'body',
            content:
              'You have now successfully completed the tutorial. You can continue with the rest of the patient visit by recording additional information or performing other necessary actions within the patient chart view, or you can return to the homepage.',
            placement: 'center',
            hideBackButton: true,
          },
        ],
      },
      {
        title: 'Starting a Patient Visit',
        description: 'Learn how to start a visit for a patient.',
        steps: [
          {
            target: '[data-tutorial-target="search-patient-icon"]',
            content:
              'To fill out any forms or encounters of a patient, you have to start a visit. To start a patient visit, first you need to go to the patient chart view of the respective patient. Click on the search icon to open the search box so that we can search for the patient. ',
            disableBeacon: true,
            spotlightClicks: true,
            hideNextButton: true,
            data: {
              autoNextOn: '[data-tutorial-target="patient-search-bar"]',
            },
          },
          {
            target: '[data-tutorial-target="patient-search-bar"]',
            content:
              'Now, enter the name or the ID of the patient here. Some example patient names that you can search for are: John, Smith, Mary.',
            hideNextButton: false,
            hideBackButton: true,
            spotlightClicks: true,
          },
          {
            target: '[data-tutorial-target="floating-search-results-container"]',
            content:
              'Click on the patient whose chart you want to access. Make sure to select a patient without the "Active visit" label, as we will start a visit in the next steps of the tutorial.',
            spotlightClicks: true,
            disableOverlay: false,
            placement: 'left',
            hideNextButton: true,
            hideBackButton: true,
            data: {
              autoNextOn: '[data-extension-slot-name="action-menu-patient-chart-items-slot"]',
            },
          },
          {
            target: '[aria-label="Start a visit"]',
            content:
              'Welcome to the patient chart view! Here, you can find detailed patient information, records of clinical visits, demographic information, graphs, and medical forms. Click on the "Start Visit" button to open the Start Visit form.',
            spotlightClicks: true,
            hideNextButton: true,
            hideBackButton: true,
            data: {
              autoNextOn: '[data-openmrs-role="Start Visit Form"]',
            },
          },
          {
            target: '[data-openmrs-role="Start Visit Form"]',
            title: 'Start Visit Form',
            content:
              'Fill out the necessary information here and click on the "Start Visit" button at the bottom of this form to start the visit. You can click on "Discard" if you don\'t want to start a visit at the moment.',
            disableOverlay: true,
            spotlightClicks: true,
            hideNextButton: true,
            hideBackButton: true,
            placement: 'left',
            data: {
              autoNextOn: '.omrs-snackbars-container div',
            },
          },
          {
            target: 'body',
            content:
              'That\'s the end of this tutorial! If you have already started a visit, you will see an "Active Visit" tag near the patient\'s name. After the visit is started, you can do things like capturing vitals, biometrics, and more through this patient chart view.',
            hideBackButton: true,
            placement: 'center',
          },
        ],
      },
      {
        title: 'Tutorial for demo purposes',
        description: 'This tutorial is for demo / debugging purposes only',
        steps: [
          {
            target: '[aria-label="OpenMRS"]',
            content: 'Let us walk through the tutorial features together.',
          },
          {
            target: '[data-extension-id="clinical-appointments-dashboard-link"]',
            content:
              'Click on this link. This step is configured to be automatic and will take you to the next step. Once the given query selector resolves an element on the page, it will proceed automatically.',
            hideCloseButton: true,
            hideNextButton: true,
            spotlightClicks: true,
            data: {
              autoNextOn: '[data-extension-id="clinical-appointments-dashboard"]',
            },
          },
          {
            target: '[data-extension-id="clinical-appointments-dashboard"]',
            content: 'Congrats! You have reached the clinical appointments dashboard.',
          },
          {
            target: '[aria-label="OpenMRS"]',
            content:
              'Now, let’s see how this behaves when elements take a bit longer to load. Set your network throttling to "Slow 3G" and hit "Next".',

            hideBackButton: true,
          },
          {
            target: '[data-extension-id="laboratory-dashboard-link"]',
            content:
              'Let\'s navigate to the laboratory page. Our next target is the "Tests Ordered" table. I’ll disappear once you reach the laboratory page and reappear when the table is loaded. See you there!',
            hideCloseButton: true,
            hideNextButton: true,

            spotlightClicks: true,
            data: {
              autoNextOn: '[data-extension-id="laboratory-dashboard"]',
            },
          },
          {
            target: '[data-extension-id="all-lab-requests-table"] table',
            content:
              "It's me again. By default, I'll wait for the element to appear, so you don't have to worry about slow components when writing a new tutorial.",

            hideBackButton: true,
          },
          {
            target: '[aria-label="OpenMRS"]',
            content:
              "Now let's do a fun exercise. Can you find out how to view a patient's allergies on your own? Feel free to turn off network throttling. ;) ",
          },
          {
            target: '[data-extension-slot-name="patient-chart-allergies-dashboard-slot"]',
            content:
              'Great job! You found the allergies section! This is the end of the tutorial. Feel free to explore the system on your own or check out the other tutorials.',
          },
        ],
      },
    ],
  },
};

export type Config = {
  showTutorial: boolean;
  tutorialData: {
    title: string;
    description: string;
    steps: {
      target: string;
      title?: string;
      content: string;
      placement?: Placement | 'center' | 'auto';
      spotlightClicks?: boolean;
      spotlightPadding?: number;
      disableOverlay?: boolean;
      disableBeacon?: boolean;
      hideBackButton?: boolean;
      hideNextButton?: boolean;
      hideFooter?: boolean;
      hideCloseButton?: boolean;
      data?: {
        autoNextOn?: string;
      };
    }[];
  }[];
};
