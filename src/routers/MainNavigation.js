import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from "react-navigation";
import GetStartedScreen from "screens/started/GetStartedScreen";
import LoginScreen from "screens/login/LoginScreen";
import SignUpScreen from "screens/signup/SignUpScreen";
import CheckNumberScreen from 'screens/signup/CheckNumberScreen';
import QRScannerScreen from 'screens/signup/QRScannerScreen';
import ForgotPasswordScreen from 'screens/forgotpassword/ForgotPasswordScreen';
import CreateNewPassword from 'screens/forgotpassword/CreateNewPassword';
import MainTempScreen from "screens/main/MainTempScreen";
import MyHGScreen from "screens/main/profile/MyHGScreen";
import RecruitmentScreen from "screens/main/recruitment/RecruitmentScreen";
import SplashScreen from 'screens/started/SplashScreen';
import DetailStarScreen from 'screens/main/profile/DetailStar/DetaiStarScreen';
import UpgradeAccountScreen from 'screens/main/upgradeaccount/UpgradeAccountScreen';
import IntroducesFriends from 'screens/main/profile/IntroduceFriends/IntroducesFriends';
import Vouchers from 'screens/main/profile/VoucherScreens/Vouchers';
import DiscountCode from 'screens/main/profile/VoucherScreens/DiscoutCode';
import SelectServiceScreen from 'screens/main/selectservice/SelectServiceScreen';
import ClickServiceScreen from 'libraries/components/ClickServiceScreen';
import DetailVoucher from 'screens/main/profile/VoucherScreens/DetailVoucher';
import R from "res/R";
import TabBarComponent from "libraries/components/TabBarComponent";
import CreateStudentPortfolioScreen from 'screens/main/recruitment/worker/create_portfolio/student/CreateStudentPortfolioScreen';
import WorkerAdvancedPortfolioScreen from 'screens/main/recruitment/worker/create_portfolio/worker/WorkerAdvancedPortfolioScreen';
import PostJobRecruitmentScreen from 'screens/main/recruitment/recruiter/post_job_recruitment/PostJobRecruitmentScreen';
import ListNewsRecruimentScreen from 'screens/main/recruitment/recruiter/list_News_recruiment/ListNewsRecruimentScreen';
import DetailProfile from 'screens/main/recruitment/recruiter/list/DetailProfile';
import PersonalPage from 'screens/main/recruitment/recruiter/personal_page/PersonalPageScreen';
import InfoRecruimentScreen from 'screens/main/recruitment/recruiter/info_recruiment/InfoRecruimentScreen';
import SearchFilterScreen from 'screens/main/recruitment/searchfilter/SearchFilterScreen';
import SavedJobScreen from 'screens/main/recruitment/recruiter/saved_job/SavedJobScreen';
import SaveProfileScreen from 'screens/main/recruitment/recruiter/save_profile/SaveProfileScreen';
import ListProfileSearch from 'screens/main/recruitment/searchfilter/ListProfileSearch';
import ListProfileScreen from 'screens/main/recruitment/recruiter/ListProfileOfMe/ListProfileScreen';
import FeedBackScreen from 'screens/main/recruitment/FeedBack/FeedBackScreen';
import InfoRecruitmentMoreScreen from 'screens/main/recruitment/recruiter/info_recruiment/InfoRecruitmentMoreScreen';
import EditProfileScreen from 'screens/main/profile/EditProfileScreen';
import MyFeedBackScreen from 'screens/main/profile/MyFeedback/MyFeedbackScreen';

const TabHome = createBottomTabNavigator(
    {
        RecruitmentScreen: { screen: RecruitmentScreen },
        MyHGScreen: { screen: MyHGScreen },

    },
    Platform.OS === 'android' ?
        {
            tabBarOptions: {
                activeTintColor: R.colors.primaryColor,
                inactiveTintColor: R.colors.grey400,
            },
            swipeEnabled: false,
            tabBarComponent: TabBarComponent,
            tabBarPosition: 'bottom',
        } : {
            tabBarOptions: {
                activeTintColor: R.colors.primaryColor,
                inactiveTintColor: R.colors.grey400,
            },
            swipeEnabled: false,
            tabBarPosition: 'bottom',
        }
)
export default MainNavigation = createStackNavigator({
    SplashScreen: { screen: SplashScreen },
    GetStartedScreen: { screen: GetStartedScreen },
    SignUpScreen: { screen: SignUpScreen },
    CheckNumberScreen: { screen: CheckNumberScreen },
    QRScannerScreen: { screen: QRScannerScreen },
    LoginScreen: { screen: LoginScreen },
    ForgotPasswordScreen: { screen: ForgotPasswordScreen },
    CreateNewPassword: { screen: CreateNewPassword },
    MainTempScreen: { screen: MainTempScreen },
    HomeScreen: { screen: TabHome },
    DetailStarScreen: { screen: DetailStarScreen },
    UpgradeAccountScreen: { screen: UpgradeAccountScreen },
    IntroducesFriends: { screen: IntroducesFriends },
    Vouchers: { screen: Vouchers },
    DiscountCode: { screen: DiscountCode },
    SelectServiceScreen: { screen: SelectServiceScreen },
    ClickServiceScreen: { screen: ClickServiceScreen },
    DetailVoucher: { screen: DetailVoucher },
    CreateStudentPortfolioScreen: { screen: CreateStudentPortfolioScreen },
    WorkerAdvancedPortfolioScreen: { screen: WorkerAdvancedPortfolioScreen },
    PostJobRecruitmentScreen: { screen: PostJobRecruitmentScreen },
    ListNewsRecruimentScreen: { screen: ListNewsRecruimentScreen },
    PersonalPage: { screen: PersonalPage },
    DetailProfile: { screen: DetailProfile },
    InfoRecruimentScreen: { screen: InfoRecruimentScreen },
    SearchFilterScreen: { screen: SearchFilterScreen },
    SavedJobScreen: { screen: SavedJobScreen },
    SaveProfileScreen: { screen: SaveProfileScreen },
    ListProfileSearch: { screen: ListProfileSearch },
    ListProfileScreen: { screen: ListProfileScreen },
    FeedBackScreen: { screen: FeedBackScreen },
    InfoRecruitmentMoreScreen: { screen: InfoRecruitmentMoreScreen },
    EditProfileScreen: { screen: EditProfileScreen },
    MyFeedBackScreen: { screen: MyFeedBackScreen }
},
    {
        headerMode: 'none'
    }
)
