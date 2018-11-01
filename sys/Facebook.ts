export enum Scops {
    email,
    public_profile,
    read_custom_friendlists,
    user_about_me,
    user_birthday,
    user_education_history,
    user_friends,
    user_hometown,
    user_location,
    user_relationship_details,
    user_relationships,
    user_religion_politics,
    user_work_history,
    publish_actions,
    invitable_friends,
    manage_pages,
    read_page_mailboxes
}
declare type fb = any;
declare var FB: any;
var appTestID = '394907654315490';
var appID = '1619534588085111';
export class Facebook  {
    private scops: string[] = [];
    status: "connected" | "not_authorized" | "unknown";
    accessToken: string; expiresIn: number; grantedScopes: string; signedRequest: string; userID: string;
    get IsConnected() { return this.status === 'connected' ? true : (this.status === 'not_authorized' ? false : null); }
    private _parseResponse(r /*:fb.AuthResponse*/) {
        this.status = r.status;
        if (r.authResponse)
            for (var i in r.authResponse)
                this[i] = r.authResponse[i];
        else {
            this.accessToken = ""; this.expiresIn = 0; this.grantedScopes = ""; this.signedRequest = ""; this.userID = "";
        }
    }
    public AsyncIsConnected(callback?: (sender: this, v: boolean) => void) {
        FB.getLoginStatus((response)=> {
            this._parseResponse(response);
            callback && callback(this, response.status === 'connected');
        });
    }
    public AllScops() {
        var scps = [];
        for (var i in Scops) {
            var v = Scops[i];
            if (typeof v === 'string')
                scps.push(Scops[i]);
        }
        this.RegisterScop(scps);
    }
    public Connect(callback?: (sender: this) => void) {
        FB.login((r) => {
            this._parseResponse(r);
            callback && callback(this);
        }, { scope: this.scops.join(','), enable_profile_selector: true, return_scopes: true, });
    }
    fbAsyncInit () {
        FB.init({
            appId: this.AppID,
            cookie: true,
            xfbml: true, 
            version: 'v2.8'
        });
        this.AsyncIsConnected();
    }



    constructor(private AppID =appTestID, debug: boolean=true) {
        if (_default != null) throw null;
        _default = this;
        var js, fjs = document.getElementsByTagName('script')[0];
        if (!document.getElementById('facebook-jssdk')) {
            js = document.createElement('script'); js.id = 'facebook-jssdk';
            var dbg = 'https://connect.facebook.net/en_US/all/debug.js';
            js.src = dbg || (debug ? "https://connect.facebook.net/en_US/sdk/debug.js" : "https://connect.facebook.net/en_US/sdk.js");
            fjs.parentNode.insertBefore(js, fjs);
        }
        this.init = this.init.bind(this);
        this.init();
    }
    
    init() {

        if (window['fbAsyncInit']) setTimeout(this.init, 200);
        window['fbAsyncInit'] = (x) => {
            window['fbAsyncInit'] = undefined;
            this.fbAsyncInit();
        };
    }
    Login(callback: (r/*:fb.AuthResponse*/) => void) {
        FB.login(callback);
    }
    getFriendsList(callback: (sender:this,r:IFriendLists) => void) {
        this.AsyncIsConnected((r) => {
            if (r.IsConnected)
                FB.api('/' + r.userID + '/friendlists', function (response) {
                    callback(r, response);
                });
        });
    }
    public get Scops() { return this.scops; }
    private _processedArrays ;
    public RegisterScop(args: Scops | Scops[] | string | string[]) {
        var isn = this._processedArrays == null;
        if (isn) this._processedArrays = [];
        switch (typeof args) {
            case 'number':
                var s = Scops[args as number];
                if (typeof s === 'string') this.scops.indexOf(s) === -1 && this.scops.push(s);
                break;
            case 'string':
                s = args as string;
                var si = Scops[s];
                if (typeof si === 'number') this.scops.indexOf(args as string) === -1 && this.scops.push(args as string);
                break;
            case 'object':
                if (args instanceof Array) {
                    if (this._processedArrays.indexOf(args) !== -1) return;
                    this._processedArrays.push(args);
                    for (var i = 0; i < args.length; i++)
                        this.RegisterScop(args[i]);
                }
                break;
            default:
        }
        if (isn) this._processedArrays = null;
    }
    someApi() {
        var c = null; FB.login((r) => { stop(); }, { scope: 'public_profile,email,invitable_friends' });
    }

    public static Default(appId?:string,debug?:boolean) {
        return _default || (_default = new Facebook(appId, debug));
    }
}
var _default: Facebook = null;
export     interface IFriendLists {
    data: { id: string }[];
    paging: { next: string };
}

export interface LocationFields {
    city:string;
    city_id: number;
    country: string;
    country_code: number;
    latitude: number;
    located_in: string;
    longitude: number;
    name: string;
    region: string;
    region_id: number;
    state: string;
    street: string;
    zip: string;
}


 export interface list<T> {

}

 export interface PageAdminNote {

}

 export interface AgeRange {

}

 export interface Interface {

}
 export interface UserContext {

}
 export interface CoverPhoto {

}
 export interface Currency {

}
 export interface UserDevice {

}
 export interface EducationExperience {

}
  export interface Experience {

}
 export interface Page {

}

 export interface PageLabel {

}


 export interface Enum {

}

 export interface MessengerPlatformReferral {

}

 export interface PaymentPricepoints {

}

 export interface SecuritySettings {

}

 export interface User {

}
 export interface VideoUploadLimits {

}

 export interface WorkExperience {

}
export interface Fields {
    about: string
    id: number|string
    address: Location
    admin_notes: list<PageAdminNote>
    age_range: AgeRange
    birthday: string
    can_review_measurement_request: boolean
    context: UserContext
    cover: CoverPhoto
    currency: Currency
    devices: list<UserDevice>
    education: list<EducationExperience>
    email: string
    employee_number: string
    favorite_athletes: list<Experience>
    favorite_teams: list<Experience>
    first_name: string
    gender: string
    hometown: Page
    inspirational_people: list<Experience>
    install_type:Enum
    installed: boolean
    interested_in: list<string>
    is_payment_enabled: boolean
    is_shared_login: boolean
    is_verified: boolean
    labels: list<PageLabel>
    languages: list<Experience>
    last_ad_referral: MessengerPlatformReferral
    last_name: string
    link: string
    local_news_megaphone_dismiss_status: boolean
    local_news_subscription_status: boolean
    locale: string
    location: Page
    meeting_for: list<string>
    middle_name: string
    name: string
    name_format: string
    payment_pricepoints: PaymentPricepoints
    political: string
    profile_pic: string
    public_key: string
    quotes: string
    relationship_status: string
    religion: string
    security_settings: SecuritySettings
    shared_login_upgrade_required_by: Date
    short_name: string
    significant_other: User
    sports: list<Experience>
    test_group: number
    third_party_id: string
    timezone: number;// (min: -24) (max: 24)
    token_for_business: string
    updated_time: Date
    verified: boolean
    video_upload_limits: VideoUploadLimits
    viewer_can_send_gift: boolean
    website: string
    work: list<WorkExperience>
}
export var Fields_Names = ['about', 'id', 'address', 'admin_notes', 'age_range', 'birthday', 'can_review_measurement_request', 'context', 'cover', 'currency', 'devices', 'education', 'email', 'employee_number', 'favorite_athletes', 'favorite_teams', 'first_name', 'gender', 'hometown', 'inspirational_people', 'install_type', 'installed', 'interested_in', 'is_payment_enabled', 'is_shared_login', 'is_verified', 'labels', 'languages', 'last_ad_referral', 'last_name', 'link', 'local_news_megaphone_dismiss_status', 'local_news_subscription_status', 'locale', 'location', 'meeting_for', 'middle_name', 'name', 'name_format', 'payment_pricepoints', 'political', 'profile_pic', 'public_key', 'quotes', 'relationship_status', 'religion', 'security_settings', 'shared_login_upgrade_required_by', 'short_name', 'significant_other', 'sports', 'test_group', 'third_party_id', 'timezone', 'token_for_business', 'updated_time', 'verified', 'video_upload_limits', 'viewer_can_send_gift', 'website', 'work'];
export enum EFields {
    about = 'about',
    id = 'id',
    address = 'address',
    admin_notes = 'admin_notes',
    age_range = 'age_range',
    birthday = 'birthday',
    can_review_measurement_request = 'can_review_measurement_request',
    context = 'context',
    cover = 'cover',
    currency = 'currency',
    devices = 'devices',
    education = 'education',
    email = 'email',
    employee_number = 'employee_number',
    favorite_athletes = 'favorite_athletes',
    favorite_teams = 'favorite_teams',
    first_name = 'first_name',
    gender = 'gender',
    hometown = 'hometown',
    inspirational_people = 'inspirational_people',
    install_type = 'install_type',
    installed = 'installed',
    interested_in = 'interested_in',
    is_payment_enabled = 'is_payment_enabled',
    is_shared_login = 'is_shared_login',
    is_verified = 'is_verified',
    labels = 'labels',
    languages = 'languages',
    last_ad_referral = 'last_ad_referral',
    last_name = 'last_name',
    link = 'link',
    local_news_megaphone_dismiss_status = 'local_news_megaphone_dismiss_status',
    local_news_subscription_status = 'local_news_subscription_status',
    locale = 'locale',
    location = 'location',
    meeting_for = 'meeting_for',
    middle_name = 'middle_name',
    name = 'name',
    name_format = 'name_format',
    payment_pricepoints = 'payment_pricepoints',
    political = 'political',
    profile_pic = 'profile_pic',
    public_key = 'public_key',
    quotes = 'quotes',
    relationship_status = 'relationship_status',
    religion = 'religion',
    security_settings = 'security_settings',
    shared_login_upgrade_required_by = 'shared_login_upgrade_required_by',
    short_name = 'short_name',
    significant_other = 'significant_other',
    sports = 'sports',
    test_group = 'test_group',
    third_party_id = 'third_party_id',
    timezone = 'timezone',
    token_for_business = 'token_for_business',
    updated_time = 'updated_time',
    verified = 'verified',
    video_upload_limits = 'video_upload_limits',
    viewer_can_send_gift = 'viewer_can_send_gift',
    website = 'website',
    work = 'work'
}

export interface Edges {
    accounts;//Facebook Pages this person administers/is an admin for
    achievements;//Achievements made in Facebook games
    ad_studies;//Ad studies that this person can view
    adaccounts;//The advertising accounts to which this person has access
    adcontracts;//The person's ad contracts
    adnetworkanalytics;//Insights data for the person's Audience Network apps
    albums;//The photo albums this person has created
    apprequestformerrecipients;//App requests
    apprequests;//This person's pending requests from an app
    asset3ds;//The 3D assets owned by the user
    assigned_ad_accounts;//assigned_ad_accounts
    assigned_monetization_properties;//assigned_monetization_properties
    assigned_pages;//assigned_pages
    assigned_product_catalogs;//assigned_product_catalogs
    books;//The books listed on this person's profile
    business_activities;//The business activities related to this user
    business_users;//Business users corresponding to the user
    businesses;//Businesses associated with the user
    conversations;//Facebook Messenger conversation
    curated_collections;//The curated collections created by this user
    custom_labels;//custom labels
    domains;//The domains the user admins
    events;//Events for this person. By default this does not include events the person has declined or not replied to
    family;//This person's family relationships.
    favorite_requests;//Developers' favorite requests to the Graph API
    friendlists;//The person's custom friend lists
    friends;//A person's friends.
    games;//Games this person likes
    groups;//The Facebook Groups that the person is a member of
    ids_for_apps;//Businesses can claim ownership of multiple apps using Business Manager. This edge returns the list of IDs that this user has in any of those other apps
    ids_for_business;//Businesses can claim ownership of multiple apps using Business Manager. This edge returns the list of IDs that this user has in any of those other apps
    ids_for_pages;//Businesses can claim ownership of apps and pages using Business Manager. This edge returns the list of IDs that this user has in any of the pages owned by this business.
    invitable_friends;//A list of friends that can be invited to install a Facebook Canvas app
    leadgen_forms;//A list of lead generation forms belonging to Pages that the user has advertiser permissions on
    likes;//All the Pages this person has liked
    live_encoders;//Live encoders owned by this person
    live_videos;//Live videos from this person
    movies;//Movies this person likes
    music;//Music this person likes
    objects;//Objects
    permissions;//The permissions that the person has granted this app
    personal_ad_accounts;//The advertising accounts to which this person has personal access
    photos;//Photos the person is tagged in or has uploaded
    picture;//The person's profile picture
    promotable_domains;//All the domains user can promote
    promotable_events;//All the events which user can promote.
    request_history;//Developers' Graph API request history
    rich_media_documents;//A list of rich media documents belonging to Pages that the user has advertiser permissions on
    session_keys;//Any session keys that the app knows the user by
    stream_filters;//A list of filters that can be applied to the News Feed edge
    taggable_friends;//Friends that can be tagged in content published via the Graph API
    tagged_places;//List of tagged places for this person. It can include tags on videos, posts, statuses or links
    television;//TV shows this person likes
    threads;//A message conversation thread
    video_broadcasts;//Video broadcasts from this person
    videos;//Videos the person is tagged in or uploaded
    checkins;//The checkins this person has made.
    feed;//The feed of posts (including status updates) and links published by this person.
    friendrequests;//A person's pending friend requests.
    home;//A person's Facebook homepage feed.
    inbox;//A person's Facebook Messages inbox.
    locations;//A feed of posts and photos that include location information and in which this person has been tagged. This is useful for constructing a chronology of places that the person has visited.
    mutualfriends;//The list of mutual friends between two people.
    notifications;//The unread Facebook notifications that a person has.
    outbox;//A person's Facebook Messages outbox.
    questions;//The questions that a person has created.
    scores;//The scores this person has received from Facebook Games that they've played.
    subscribers;//The profiles that are following this person.
    subscribedto;//The profile that this person is following."
}
export var Edges_fields = ['accounts', 'achievements', 'ad_studies', 'adaccounts', 'adcontracts', 'adnetworkanalytics', 'albums', 'apprequestformerrecipients', 'apprequests', 'asset3ds', 'assigned_ad_accounts', 'assigned_monetization_properties', 'assigned_pages', 'assigned_product_catalogs', 'books', 'business_activities', 'business_users', 'businesses', 'conversations', 'curated_collections', 'custom_labels', 'domains', 'events', 'family', 'favorite_requests', 'friendlists', 'friends', 'games', 'groups', 'ids_for_apps', 'ids_for_business', 'ids_for_pages', 'invitable_friends', 'leadgen_forms', 'likes', 'live_encoders', 'live_videos', 'movies', 'music', 'objects', 'permissions', 'personal_ad_accounts', 'photos', 'picture', 'promotable_domains', 'promotable_events', 'request_history', 'rich_media_documents', 'session_keys', 'stream_filters', 'taggable_friends', 'tagged_places', 'television', 'threads', 'video_broadcasts', 'videos', 'checkins', 'feed', 'friendrequests', 'home', 'inbox', 'locations', 'mutualfriends', 'notifications', 'outbox', 'questions', 'scores', 'subscribers', 'subscribedto'];