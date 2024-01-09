[권한]
- 총관리자의 권한명은 super_admin 이다.
- 팀관리자의 권한은 super, high, normal 로 나뉘고, 팀Id에 따라 teamId_super_admin, teamId_high_admin, teamId_normal_admin 으로 나뉜다.
- 모든 유저는 팀당 위의 3가지 권한중 하나만을 가지며 user/uid/roles=[] db에 저장된다.
- super 권한의 관리자만 다른 관리자들의 등급을 승격 또는 강등시킬 수 있다.