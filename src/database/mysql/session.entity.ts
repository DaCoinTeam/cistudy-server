import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn
} from "typeorm"

import { AccountEntity } from "./account.entity"

@Entity("session")
export class SessionEntity {
  @PrimaryGeneratedColumn("uuid")
      sessionId: string

  @Column({ type: "uuid", length: "36" })
      accountId: string

  @CreateDateColumn()
      createdAt: Date
  
  @UpdateDateColumn()
      updatedAt: Date

  @Column({ type: "boolean", default: false })
      isDisabled: boolean

  @Column({ type: "int", default: 0 })
      numberOfUpdates: number

  @Column({
      type: "uuid", length: "36"
  })
      clientId: string

  @ManyToOne(() => AccountEntity, (account) => account.sessions, {onDelete : "CASCADE"})
  @JoinColumn({ name: "accountId" })
      account: AccountEntity
}
