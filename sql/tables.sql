create table leu_stock_info (
    stock_code varchar(6) default '000004' not null primary key,
    market varchar(4) default 'SZ' null,
    stock_name varchar(6) default '' null,
    curr_capital decimal(20, 10) default '0.0000000000' null,
    total_capital decimal(20, 10) default '0.0000000000' null,
    pinyin varchar(6) default '' null,
    listing_date timestamp default '2000-01-01 00:00:00' null,
    curr_status int default '1' null
);

create table leu_price_perday (
    stock_code varchar(6) default '000004' not null,
    yest_price decimal(8, 3) default '1.000' null,
    open_price decimal(8, 3) default '1.000' null,
    close_price decimal(8, 3) default '1.000' null,
    high_price decimal(8, 3) default '1.000' null,
    low_price decimal(8, 3) default '1.000' null,
    trade_num bigint default '0' null,
    trade_amount bigint default '0' null,
    trade_date varchar(8) default '20000101' null,
    change_px decimal(8, 3) default '1.000' null,
    change_px_rate decimal(5, 2) default '0.00' null,
    continuous int default '0' null,
    pp_id bigint auto_increment primary key,
    constraint i_u_lpp_code_date unique (stock_code, trade_date)
);

create table leu_stock_prediction (
    stock_code varchar(6) default '000004' null,
    pr_date varchar(8) default '20000102' null,
    curr_date varchar(8) default '20000101' null,
    is_rise tinyint(1) default '0' null,
    pr_is_rise tinyint(1) default '0' null,
    correct tinyint(1) default '0' null,
    continuous_times text null,
    pr_id bigint auto_increment primary key,
    constraint i_u_lsp_code_date unique (stock_code, pr_date)
);


create table leu_prediction_result (
    stock_code varchar(6) not null primary key,
    continuous_times text null,
    rise_continuous int default '1' null,
    fall_continuous int default '1' null,
    rise_result tinyint(1) default '0' null,
    fall_result tinyint(1) default '0' null,
    rate_history decimal(5, 2) default '0.00' null,
    rate_3y decimal(5, 2) default '0.00' null,
    rate_1y decimal(5, 2) default '0.00' null,
    rate_6m decimal(5, 2) default '0.00' null,
    rate_3m decimal(5, 2) default '0.00' null,
    rate_1m decimal(5, 2) default '0.00' null,
    rate_1w decimal(5, 2) default '0.00' null,
);

