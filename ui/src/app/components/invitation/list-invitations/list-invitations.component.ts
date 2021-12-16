import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { InvitationEntryInfo } from 'src/app/models/invitation';
import { InvitationStore } from '../../../store/invitation.store';
import { ProfileStore } from 'src/app/store/profile.store';
import { map } from 'rxjs/operators';
import { Dictionary } from 'src/app/helpers/utils';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'list-invitations',
  templateUrl: './list-invitations.component.html',
  styleUrls: ['./list-invitations.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InvitationListComponent implements OnDestroy{
  public displayedColumns = ['inviter', 'invitees', 'timestamp', 'invitees_who_accepted', 'invitees_who_rejected', 'action' ];
  public dataSource$:Observable<InvitationEntryInfo[]> = this._invitationStore.selectInvitations()
  private profileDictionarySubscription$!: Subscription
  private profileDictionary:Dictionary<string> = {}
  
  constructor(private readonly _invitationStore: InvitationStore, private readonly _profileStore: ProfileStore) {}


  ngOnInit(){
    this.profileDictionarySubscription$ = this._profileStore.selectProfiles().pipe(map(agentprofiles=> agentprofiles?.map(ap=> {return {[ap.agent_pub_key]:ap.profile!.nickname}}))).subscribe(res=>
      this.profileDictionary = Object.assign({},...res)
     ) // .subscribe(res => {this.agentDictionary = Object.assign({}, ...res.map((x) => ({[x.agent_pub_key]: x.nickname})))});
  }

  ngOnDestroy(){
    this.profileDictionarySubscription$.unsubscribe()
  }

  accept(header_hash:string){
    this._invitationStore.acceptInvitation(header_hash)
  }

  reject(header_hash:string){
    this._invitationStore.rejectInvitation(header_hash)
  }

  hashToAgent(hash:string):string{
    console.log("profile_list:",this.profileDictionary)
    return this.profileDictionary[hash]
  }

  hashListToAgentList(hashlist:string[]):string[] {
    const res:string[] = []
    for(const hash of hashlist){
      res.push(this.profileDictionary[hash])
    }
    return res
  }

  editInvitation(header_hash: string): void {
    //this._invitationStore.editInvitation(header_hash);
  }
}

