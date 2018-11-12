export declare module Social.Facebook {
    enum Scops {
        email = 0,
        public_profile = 1,
        read_custom_friendlists = 2,
        user_about_me = 3,
        user_birthday = 4,
        user_education_history = 5,
        user_friends = 6,
        user_hometown = 7,
        user_location = 8,
        user_relationship_details = 9,
        user_relationships = 10,
        user_religion_politics = 11,
        user_work_history = 12,
        publish_actions = 13,
        invitable_friends = 14,
        manage_pages = 15,
        read_page_mailboxes = 16
    }
    class Facebook {
        private AppID;
        private scops;
        status: "connected" | "not_authorized" | "unknown";
        accessToken: string;
        expiresIn: number;
        grantedScopes: string;
        signedRequest: string;
        userID: string;
        readonly IsConnected: boolean;
        private _parseResponse;
        AsyncIsConnected(callback?: (sender: this, v: boolean) => void): void;
        AllScops(): void;
        Connect(callback?: (sender: this) => void): void;
        fbAsyncInit(): void;
        constructor(AppID?: string, debug?: boolean);
        init(): void;
        Login(callback: (r: any) => void): void;
        getFriendsList(callback: (sender: this, r: IFriendLists) => void): void;
        readonly Scops: string[];
        private _processedArrays;
        RegisterScop(args: Scops | Scops[] | string | string[]): void;
        someApi(): void;
        static Default(appId?: string, debug?: boolean): Facebook;
    }
    interface IFriendLists {
        data: {
            id: string;
        }[];
        paging: {
            next: string;
        };
    }
    interface LocationFields {
        city: string;
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
    interface list<T> {
    }
    interface PageAdminNote {
    }
    interface AgeRange {
    }
    interface Interface {
    }
    interface UserContext {
    }
    interface CoverPhoto {
    }
    interface Currency {
    }
    interface UserDevice {
    }
    interface EducationExperience {
    }
    interface Experience {
    }
    interface Page {
    }
    interface PageLabel {
    }
    interface Enum {
    }
    interface MessengerPlatformReferral {
    }
    interface PaymentPricepoints {
    }
    interface SecuritySettings {
    }
    interface User {
    }
    interface VideoUploadLimits {
    }
    interface WorkExperience {
    }
    interface Fields {
        about: string;
        id: number | string;
        address: Location;
        admin_notes: list<PageAdminNote>;
        age_range: AgeRange;
        birthday: string;
        can_review_measurement_request: boolean;
        context: UserContext;
        cover: CoverPhoto;
        currency: Currency;
        devices: list<UserDevice>;
        education: list<EducationExperience>;
        email: string;
        employee_number: string;
        favorite_athletes: list<Experience>;
        favorite_teams: list<Experience>;
        first_name: string;
        gender: string;
        hometown: Page;
        inspirational_people: list<Experience>;
        install_type: Enum;
        installed: boolean;
        interested_in: list<string>;
        is_payment_enabled: boolean;
        is_shared_login: boolean;
        is_verified: boolean;
        labels: list<PageLabel>;
        languages: list<Experience>;
        last_ad_referral: MessengerPlatformReferral;
        last_name: string;
        link: string;
        local_news_megaphone_dismiss_status: boolean;
        local_news_subscription_status: boolean;
        locale: string;
        location: Page;
        meeting_for: list<string>;
        middle_name: string;
        name: string;
        name_format: string;
        payment_pricepoints: PaymentPricepoints;
        political: string;
        profile_pic: string;
        public_key: string;
        quotes: string;
        relationship_status: string;
        religion: string;
        security_settings: SecuritySettings;
        shared_login_upgrade_required_by: Date;
        short_name: string;
        significant_other: User;
        sports: list<Experience>;
        test_group: number;
        third_party_id: string;
        timezone: number;
        token_for_business: string;
        updated_time: Date;
        verified: boolean;
        video_upload_limits: VideoUploadLimits;
        viewer_can_send_gift: boolean;
        website: string;
        work: list<WorkExperience>;
    }
    var Fields_Names: string[];
    enum EFields {
        about = "about",
        id = "id",
        address = "address",
        admin_notes = "admin_notes",
        age_range = "age_range",
        birthday = "birthday",
        can_review_measurement_request = "can_review_measurement_request",
        context = "context",
        cover = "cover",
        currency = "currency",
        devices = "devices",
        education = "education",
        email = "email",
        employee_number = "employee_number",
        favorite_athletes = "favorite_athletes",
        favorite_teams = "favorite_teams",
        first_name = "first_name",
        gender = "gender",
        hometown = "hometown",
        inspirational_people = "inspirational_people",
        install_type = "install_type",
        installed = "installed",
        interested_in = "interested_in",
        is_payment_enabled = "is_payment_enabled",
        is_shared_login = "is_shared_login",
        is_verified = "is_verified",
        labels = "labels",
        languages = "languages",
        last_ad_referral = "last_ad_referral",
        last_name = "last_name",
        link = "link",
        local_news_megaphone_dismiss_status = "local_news_megaphone_dismiss_status",
        local_news_subscription_status = "local_news_subscription_status",
        locale = "locale",
        location = "location",
        meeting_for = "meeting_for",
        middle_name = "middle_name",
        name = "name",
        name_format = "name_format",
        payment_pricepoints = "payment_pricepoints",
        political = "political",
        profile_pic = "profile_pic",
        public_key = "public_key",
        quotes = "quotes",
        relationship_status = "relationship_status",
        religion = "religion",
        security_settings = "security_settings",
        shared_login_upgrade_required_by = "shared_login_upgrade_required_by",
        short_name = "short_name",
        significant_other = "significant_other",
        sports = "sports",
        test_group = "test_group",
        third_party_id = "third_party_id",
        timezone = "timezone",
        token_for_business = "token_for_business",
        updated_time = "updated_time",
        verified = "verified",
        video_upload_limits = "video_upload_limits",
        viewer_can_send_gift = "viewer_can_send_gift",
        website = "website",
        work = "work"
    }
    interface Edges {
        accounts: any;
        achievements: any;
        ad_studies: any;
        adaccounts: any;
        adcontracts: any;
        adnetworkanalytics: any;
        albums: any;
        apprequestformerrecipients: any;
        apprequests: any;
        asset3ds: any;
        assigned_ad_accounts: any;
        assigned_monetization_properties: any;
        assigned_pages: any;
        assigned_product_catalogs: any;
        books: any;
        business_activities: any;
        business_users: any;
        businesses: any;
        conversations: any;
        curated_collections: any;
        custom_labels: any;
        domains: any;
        events: any;
        family: any;
        favorite_requests: any;
        friendlists: any;
        friends: any;
        games: any;
        groups: any;
        ids_for_apps: any;
        ids_for_business: any;
        ids_for_pages: any;
        invitable_friends: any;
        leadgen_forms: any;
        likes: any;
        live_encoders: any;
        live_videos: any;
        movies: any;
        music: any;
        objects: any;
        permissions: any;
        personal_ad_accounts: any;
        photos: any;
        picture: any;
        promotable_domains: any;
        promotable_events: any;
        request_history: any;
        rich_media_documents: any;
        session_keys: any;
        stream_filters: any;
        taggable_friends: any;
        tagged_places: any;
        television: any;
        threads: any;
        video_broadcasts: any;
        videos: any;
        checkins: any;
        feed: any;
        friendrequests: any;
        home: any;
        inbox: any;
        locations: any;
        mutualfriends: any;
        notifications: any;
        outbox: any;
        questions: any;
        scores: any;
        subscribers: any;
        subscribedto: any;
    }
    var Edges_fields: string[];
}
